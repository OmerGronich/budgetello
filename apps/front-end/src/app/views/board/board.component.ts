import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  BoardsService,
  IBoard,
  ICard,
  IList,
  SummaryListCardType,
  SummaryListCardTypesInOrder,
} from '../../services/boards/boards.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { LIST_OPERATORS_TO_PROPS, LIST_TYPES } from '../../constants';
import { arrayRemove, arrayUnion } from '@angular/fire/firestore';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'budgetello-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardComponent {
  private boardDoc: AngularFirestoreDocument<Partial<IBoard>>;
  board$: Observable<IBoard>;

  constructor(
    private boardsService: BoardsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    ({ board$: this.board$, boardDoc: this.boardDoc } =
      this.boardsService.getBoard(this.boardId));
  }
  get boardId() {
    return this.route.snapshot.paramMap.get('id') || '';
  }

  updateBoardTitle($event: { title: string }) {
    this.boardDoc.update($event);
  }

  deleteBoard(board: IBoard) {
    this.boardsService.deleteAssociatedLists(board);
    this.boardDoc.delete();
    this.router.navigate(['/']);
  }

  updateList($event: { title: string; id: string }) {
    this.boardsService.updateList($event);
  }

  async addList({
    title,
    type,
  }: {
    $event?: Event | string;
    title: any;
    type: any;
  }) {
    const listRef = await this.boardsService.addList({
      title,
      type,
    });
    this.boardDoc.update({
      lists: arrayUnion(listRef) as unknown as IList[],
    });
  }

  getListCssClass(list: IList) {
    return `list-${LIST_OPERATORS_TO_PROPS[list.type]?.toLowerCase()}`;
  }

  createCard(
    {
      submitEvent,
      cardTitle,
      amount,
    }: {
      cardTitle: string;
      amount: string;
      submitEvent: SubmitEvent;
    },
    list: IList
  ) {
    submitEvent.preventDefault();

    this.boardsService.createCard({
      list,
      title: cardTitle,
      amount: amount,
    });
  }

  reorderLists(lists: IList[]) {
    const summaryListIndex = lists.findIndex(
      (list) => list.type === LIST_TYPES.Summary
    );
    const docRefs = lists
      .filter((list) => list.type !== LIST_TYPES.Summary)
      .map((list) => this.boardsService.getListRef(list.id));
    this.boardDoc.update({
      lists: docRefs as unknown as IList[],
      summaryListIndex,
    });
  }

  reorderCards(
    { lists, event }: { lists: any[]; event: CdkDragDrop<any> },
    board: IBoard
  ) {
    const isSummaryList = event.container.data.some((card: ICard) =>
      board.summaryListCardTypesInOrder?.includes(
        card.id as SummaryListCardType
      )
    );
    if (isSummaryList) {
      this.boardDoc.update({
        summaryListCardTypesInOrder: event.container.data.map(
          (card: ICard) => card.id
        ),
      });
    } else {
      this.boardsService.setLists(lists);
    }
  }

  deleteList(list: IList) {
    const listRef = this.boardsService.getListRef(list.id);
    this.boardDoc.update({
      lists: arrayRemove(listRef) as unknown as IList[],
    });
    listRef.delete();
  }
}
