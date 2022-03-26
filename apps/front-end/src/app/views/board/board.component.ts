import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  BoardsService,
  IBoard,
  IList,
} from '../../services/boards/boards.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { LIST_OPERATORS_TO_PROPS } from '../../constants';
import { arrayRemove, arrayUnion } from '@angular/fire/firestore';

@Component({
  selector: 'budgetello-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardComponent {
  private boardDoc: AngularFirestoreDocument<Partial<IBoard>>;
  board$: Observable<IBoard>;
  lists$: Observable<IList[]>;

  constructor(
    private boardsService: BoardsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    ({ board$: this.board$, boardDoc: this.boardDoc } =
      this.boardsService.getBoard(this.boardId));

    this.lists$ = this.board$.pipe(
      switchMap((board) => this.boardsService.getLists(board))
    );
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
    const docRefs = lists.map((list) => this.boardsService.getListRef(list.id));
    this.boardDoc.update({ lists: docRefs as unknown as IList[] });
  }

  reorderCards(lists: IList[]) {
    this.boardsService.setLists(lists);
  }

  deleteList(list: IList) {
    const listRef = this.boardsService.getListRef(list.id);
    this.boardDoc.update({
      lists: arrayRemove(listRef) as unknown as IList[],
    });
    listRef.delete();
  }
}
