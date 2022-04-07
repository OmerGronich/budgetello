import { Injectable } from '@angular/core';
import { BoardState, BoardStore } from './board.store';
import {
  BehaviorSubject,
  combineLatest,
  defaultIfEmpty,
  filter,
  map,
  Observable,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { Board } from './board.model';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  DocumentReference,
} from '@angular/fire/compat/firestore';
import { Card, List, SummaryListCardType } from './types';
import dayjs from 'dayjs';
import { LIST_OPERATORS, LIST_TYPES } from '../../../constants';
import firebase from 'firebase/compat/app';
import { Timestamp } from '@angular/fire/firestore';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { RouterQuery } from '@datorama/akita-ng-router-store';

export type BoardIdToListsTotals = Record<
  string,
  {
    totalIncome: number;
    totalExpenses: number;
  }
>;

@Injectable({ providedIn: 'root' })
export class BoardService {
  subscriptions: Subscription[] = [];
  boardDoc: AngularFirestoreDocument<Board>;
  boardCollection: AngularFirestoreCollection<Board>;
  listCollection: AngularFirestoreCollection<List>;
  cardCollection: AngularFirestoreCollection<Card>;
  private boardIdToListsTotals: BoardIdToListsTotals;

  private dateRange$$ = new BehaviorSubject([
    dayjs().startOf('month').toDate(),
    dayjs().endOf('month').toDate(),
  ]);

  get dateRange$() {
    return this.dateRange$$.asObservable();
  }

  constructor(
    private boardStore: BoardStore,
    private afs: AngularFirestore,
    private routerQuery: RouterQuery
  ) {
    this.boardCollection = this.afs.collection<Board>('boards');
    this.listCollection = this.afs.collection<List>('lists');
    this.cardCollection = this.afs.collection('cards');
  }

  init() {
    const board$ = this.routerQuery.selectParams('id').pipe(
      switchMap((id) => {
        this.boardDoc = this.afs.doc<Board>('boards/' + id);
        return this.boardDoc.valueChanges({ idField: 'id' }).pipe(
          filter(Boolean),
          switchMap((board) => this.getLists(board)),
          map(this.getBoardWithAreListsEmpty.bind(this)),
          tap(this.getSummaryListCalculations.bind(this)),
          map(this.getSummaryListByBoard.bind(this))
        );
      })
    );

    this.subscriptions.push(
      board$.subscribe((board) => {
        if (
          !this.boardStore.getValue().board?.v ||
          board.v === this.boardStore.getValue().board?.v
        ) {
          this.boardStore.update((state) => ({ ...state, board }));
        }
      })
    );
  }

  destroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  getLists(board: Board) {
    return combineLatest(
      board.lists.map((list) => this.getList(<any>list))
    ).pipe(map((lists) => ({ ...board, lists })));
  }

  getList(ref: DocumentReference<List>) {
    return this.afs
      .doc<List>(ref)
      .valueChanges({ idField: 'id' })
      .pipe(
        filter(Boolean),
        switchMap(this.getCards.bind(this))
      ) as Observable<List>;
  }

  private getCards(list: List) {
    const docRefs = ((<any>list).cards || []).map(
      (cardRef: DocumentReference) =>
        this.afs.doc(cardRef).valueChanges({ idField: 'id' })
    );

    return combineLatest(docRefs).pipe(
      defaultIfEmpty([] as any),
      switchMap((cards: Card[]) =>
        this.dateRange$.pipe(
          map(([start, end]) => ({
            ...list,
            cards: this.filterCardsByDateRange(cards, start, end),
          }))
        )
      )
    );
  }

  private filterCardsByDateRange(cards: Card[], start: Date, end: Date) {
    return cards.filter(
      (card) =>
        card.created &&
        start &&
        end &&
        card.created.toDate().getTime() >= start.getTime() &&
        card.created.toDate().getTime() <= end.getTime()
    );
  }

  private getBoardWithAreListsEmpty(board: Board) {
    return {
      ...board,
      areListsEmpty: board.lists.every((list) => !list.cards.length),
    };
  }

  private getSummaryListCalculations(board: Board) {
    this.boardIdToListsTotals = {
      [board.id as string]: {
        totalIncome: this.getTotalIncome(board),
        totalExpenses: this.getTotalExpenses(board),
      },
    };
  }

  getTotalIncome(board: Board) {
    return this.getListTotalByType({ board, type: LIST_TYPES.Income });
  }

  private getTotalExpenses(board: Board) {
    return this.getListTotalByType({ board, type: LIST_TYPES.Expense });
  }

  getListTotalByType({ type, board }: { type: LIST_OPERATORS; board: Board }) {
    return board.lists
      .filter((list) => list.type === type)
      .reduce((acc, list) => acc + this.calculateListTotal(list), 0);
  }

  calculateListTotal(list: List) {
    return list.cards.reduce((acc, card) => acc + +(card.amount || 0), 0);
  }

  private getSummaryListByBoard(board: Board) {
    const summaryListIndex = this.getSummaryListIndex(board);
    const lists = [...board.lists];
    lists.splice(summaryListIndex, 0, this.createSummaryList(board));

    return {
      ...board,
      lists,
    };
  }

  private getSummaryListIndex(board: Board) {
    return [null, undefined].includes(<any>board.summaryListIndex)
      ? board.lists.length
      : (board.summaryListIndex as number);
  }

  private createSummaryList(board: Board): List {
    return {
      id: 'summary',
      title: 'Summary',
      type: LIST_TYPES.Summary,
      doNotEnter: true,
      lockAxis: 'y' as const,
      cards: board.areListsEmpty
        ? []
        : board.summaryListCardTypesInOrder?.map((cardType) =>
            this.summaryListCardTypeToCreateFn(cardType)(board)
          ) || [],
    };
  }

  summaryListCardTypeToCreateFn(type: SummaryListCardType) {
    return {
      totalIncome: this.createTotalIncomeCard.bind(this),
      totalExpenses: this.createTotalExpenseCard.bind(this),
      netIncome: this.createNetIncomeCard.bind(this),
      savingsTarget: this.createSavingsTargetCard.bind(this),
      discretionaryIncome: this.createDiscretionaryIncomeCard.bind(this),
    }[type];
  }

  private createNetIncomeCard(board: Board): Card {
    return {
      id: 'netIncome',
      title: 'Net Income',
      amount: this.getNetIncomeAmount(board),
      disableDrag: false,
    };
  }

  private createSavingsTargetCard(board: Board): Card {
    const { totalIncome, totalExpenses } =
      this.boardIdToListsTotals[board.id as string];
    return {
      id: 'savingsTarget',
      title: 'Savings Target (20%)',
      amount:
        totalIncome <= totalExpenses
          ? '0'
          : this.getSavingsTarget(board).toFixed(2),
    };
  }

  private createDiscretionaryIncomeCard(board: Board): Card {
    const { totalIncome, totalExpenses } =
      this.boardIdToListsTotals[board.id as string];

    const netIncomeAmount = +this.getNetIncomeAmount(board);
    const amount =
      totalIncome <= totalExpenses
        ? '0'
        : (netIncomeAmount - +this.getSavingsTarget(board)).toFixed(2);
    return {
      id: 'discretionaryIncome',
      title: 'Discretionary Income',
      amount,
    };
  }

  private createTotalIncomeCard(board: Board): Card {
    return {
      id: 'totalIncome',
      title: 'Total Income',
      amount: this.getTotalIncome(board).toFixed(2),
    };
  }

  private createTotalExpenseCard(board: Board): Card {
    return {
      id: 'totalExpenses',
      title: 'Total Expenses',
      amount: this.getTotalExpenses(board).toFixed(2),
    };
  }

  private getSavingsTarget(board: Board) {
    return +this.getNetIncomeAmount(board) * 0.2;
  }

  private getNetIncomeAmount(board: Board): string {
    const { totalIncome, totalExpenses } =
      this.boardIdToListsTotals[board.id as string];

    return (totalIncome - totalExpenses).toFixed(2);
  }

  deleteBoard() {
    const board = this.boardStore.getValue().board;
    if (!board) {
      throw new Error('Something went wrong while deleting board');
    }

    board?.lists
      .filter((list) => list.type !== LIST_TYPES.Summary)
      .forEach((list) => {
        this.deleteAssociatedCards(list);
      });
    this.deleteAssociatedLists(board);
    this.boardDoc.delete();
    this.boardStore.update({ board: null });
  }

  deleteAssociatedLists(board: Board) {
    board.lists
      .filter((list) => list.type !== LIST_TYPES.Summary)
      .forEach((list) => {
        this.afs.doc('lists/' + list.id).delete();
      });
    this.boardDoc.update({ lists: [] });
  }

  deleteAssociatedCards(list: List) {
    list.cards.forEach((card) => {
      this.afs.doc('cards/' + card.id).delete();
    });
    this.listCollection.doc(list.id).update({ cards: [] });
  }

  updateBoardTitle(title: string) {
    const v = Date.now();

    this.boardDoc.update({ title, v });
    this.boardStore.update(
      (state) =>
        ({
          ...state,
          board: {
            ...state.board,
            v,
            title,
          },
        } as BoardState)
    );
  }

  updateListTitle({ title, id }: { title: string; id: string }) {
    this.listCollection.doc(id).update({ title });
    this.boardStore.update((state) => {
      const lists = (state.board as Board).lists.map((list) =>
        list.id === id ? { ...list, title } : list
      );

      return {
        ...state,
        board: {
          ...state.board,
          lists,
        },
      } as BoardState;
    });
  }

  async addList({ title, type }: { title: string; type: LIST_OPERATORS }) {
    const v = Date.now();
    const list = {
      title,
      type,
      cards: [],
      created: firebase.firestore.FieldValue.serverTimestamp() as Timestamp,
    };
    const listRef = await this.listCollection.add(list);
    this.boardDoc.update({
      v,
      lists: firebase.firestore.FieldValue.arrayUnion(
        listRef
      ) as unknown as List[],
    });

    this.boardStore.update((state) => {
      const lists = [...(state.board as Board).lists, list];
      return {
        ...state,
        board: {
          ...state.board,
          v,
          lists,
        },
      } as BoardState;
    });
  }

  async addCard({
    amount,
    list,
    title,
  }: {
    amount: string;
    list: List;
    title: string;
  }) {
    const v = Date.now();

    const card = {
      title,
      amount,
      created: firebase.firestore.FieldValue.serverTimestamp() as Timestamp,
    };
    const cardRef = await this.cardCollection.add(card);
    this.listCollection.doc(list.id).update({
      cards: firebase.firestore.FieldValue.arrayUnion(
        cardRef
      ) as unknown as Card[],
    });

    this.boardDoc.update({ v });
    this.boardStore.update((state) => {
      const lists = (state.board as Board).lists.map((l) =>
        l.id === list.id
          ? {
              ...l,
              cards: [...l.cards, card],
            }
          : l
      );

      return {
        ...state,
        board: {
          ...state.board,
          v,
          lists,
        },
      } as BoardState;
    });
  }

  setListsOrder(lists: List[]) {
    const v = Date.now();

    const summaryListIndex = lists.findIndex(
      (list) => list.type === LIST_TYPES.Summary
    );

    const listRefs = lists
      .filter((list) => list.type !== LIST_TYPES.Summary)
      .map((list) => {
        const listDoc = this.listCollection.doc(list.id);

        listDoc.update({
          cards: list.cards.map(
            (card) => this.cardCollection.doc(card.id).ref
          ) as unknown as Card[],
        });

        return listDoc.ref as DocumentReference<List>;
      });

    this.boardDoc.update({
      v,
      lists: listRefs as unknown as List[],
      summaryListIndex,
    });

    this.boardStore.update(
      (state) =>
        ({
          ...state,
          board: {
            ...state.board,
            v,
            lists,
          },
        } as BoardState)
    );
  }

  setCardsOrder({ lists, event }: { lists: List[]; event: CdkDragDrop<any> }) {
    const isSummaryList = event.container.data.some((card: Card) =>
      this.boardStore
        .getValue()
        .board?.summaryListCardTypesInOrder?.includes(
          card.id as SummaryListCardType
        )
    );
    if (isSummaryList) {
      this.boardDoc.update({
        summaryListCardTypesInOrder: event.container.data.map(
          (card: Card) => card.id
        ),
      });
    } else {
      this.setListsOrder(lists);
    }
  }

  deleteList(list: List) {
    this.deleteAssociatedCards(list);
    const listDoc = this.listCollection.doc(list.id);
    listDoc.delete();
    this.boardDoc.update({
      lists: firebase.firestore.FieldValue.arrayRemove(
        listDoc.ref
      ) as unknown as List[],
    });
    this.boardStore.update((state) => {
      const lists = (state.board as Board).lists.filter(
        (l) => l.id !== list.id
      );
      return {
        ...state,
        board: {
          ...state.board,
          lists,
        },
      } as BoardState;
    });
  }

  setDateRange$($event: [Date, Date]) {
    this.dateRange$$.next($event);
  }

  updateCard(card: Card, list: List) {
    this.cardCollection
      .doc(card.id)
      .update({ ...card })
      .then(() => {
        this.boardStore.update((state) => {
          const lists = state.board?.lists.map((l) => {
            if (l.id === list.id) {
              const cards = l.cards.map((c) => {
                if (c.id === card.id) {
                  return { ...c, ...card };
                }
                return c;
              });
              return {
                ...l,
                cards,
              };
            }
            return l;
          });

          return {
            ...state,
            board: {
              ...state.board,
              lists,
            },
          } as BoardState;
        });
      });
  }

  async deleteCard(card: Card, list: List) {
    const cardDoc = this.cardCollection.doc(card.id);
    await Promise.all([
      this.listCollection.doc(list.id).update({
        cards: firebase.firestore.FieldValue.arrayRemove(
          cardDoc.ref
        ) as unknown as Card[],
      }),
      cardDoc.delete(),
    ]);

    this.boardStore.update((state) => {
      const lists = state.board?.lists.map((l) => {
        if (l.id === list.id) {
          const cards = l.cards.filter((c) => c.id !== card.id);
          return {
            ...l,
            cards,
          };
        }
        return l;
      });

      return {
        ...state,
        board: {
          ...state.board,
          lists,
        },
      } as BoardState;
    });
  }
}
