import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  BoardsService,
  IBoard,
  ICard,
  IList,
  SummaryListCardType,
} from '../../services/boards/boards.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, ReplaySubject, Subscription } from 'rxjs';
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
export class BoardComponent implements OnInit, OnDestroy {
  private boardDoc: AngularFirestoreDocument<Partial<IBoard>>;
  boardFromDb$: Observable<IBoard>;
  subscriptions: Subscription[] = [];

  // todo - this behavior subject is for optimistic updates - need to figure out a better way
  private board$$ = new BehaviorSubject<IBoard | null>(null);

  get board$() {
    return this.board$$.asObservable();
  }

  constructor(
    private boardsService: BoardsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    ({ board$: this.boardFromDb$, boardDoc: this.boardDoc } =
      this.boardsService.getBoard(this.boardId));
  }

  ngOnInit() {
    this.subscriptions.push(
      this.boardFromDb$.subscribe((board) => {
        this.board$$.next(board);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  get boardId() {
    return this.route.snapshot.paramMap.get('id') || '';
  }

  updateBoardTitle($event: { title: string }) {
    this.board$$.next({
      ...(this.board$$.getValue() as IBoard),
      title: $event.title,
    });
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

    this.boardsService.addCard({
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
      .map((list) => this.boardsService.getListRef(list.id as string));
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
    const listRef = this.boardsService.getListRef(list.id as string);
    this.boardDoc.update({
      lists: arrayRemove(listRef) as unknown as IList[],
    });
    this.boardsService.deleteListCards(list);
    listRef.delete();
  }
}
