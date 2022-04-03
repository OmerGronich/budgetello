import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
} from '@angular/fire/compat/firestore';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  defaultIfEmpty,
  filter,
  firstValueFrom,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { connectFirestoreEmulator } from '@angular/fire/firestore';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../authentication/authentication.service';
import { LIST_OPERATORS, LIST_TYPES } from '../../constants';
import firebase from 'firebase/compat/app';
import dayjs from 'dayjs';
import FieldValue = firebase.firestore.FieldValue;
import Timestamp = firebase.firestore.Timestamp;

export interface ICard {
  title: string;
  amount: string;
  created?: Timestamp;
  id?: string;
  disableDrag?: boolean;
}

export interface IList extends Partial<DocumentReference> {
  type: LIST_OPERATORS;
  id?: string;
  title: string;
  cards: ICard[];
  created?: Timestamp;
  disableDrag?: boolean;
  doNotEnter?: boolean;
  lockAxis?: 'x' | 'y';
}

export type SummaryListCardType =
  | 'totalIncome'
  | 'totalExpenses'
  | 'netIncome'
  | 'savingsTarget'
  | 'discretionaryIncome';
export type SummaryListCardTypesInOrder = Array<SummaryListCardType>;

export type IBoard = {
  id?: string;
  title: string;
  lists: IList[];
  user: string;
  created: FieldValue;
  areListsEmpty?: boolean;
  summaryListIndex?: number;
  summaryListCardTypesInOrder?: SummaryListCardTypesInOrder;
};

export type BoardIdToListsTotals = Record<
  string,
  {
    totalIncome: number;
    totalExpenses: number;
  }
>;

@Injectable({
  providedIn: 'root',
})
export class BoardsService {
  private boardsCollection: AngularFirestoreCollection<IBoard>;
  private listsCollection: AngularFirestoreCollection<IList>;
  private boardsCollection$: Observable<AngularFirestoreCollection<IBoard>>;
  boards$: Observable<IBoard[]>;
  private boardIdToListsTotals: BoardIdToListsTotals;
  private dateRange$$ = new BehaviorSubject([
    dayjs().startOf('month').toDate(),
    dayjs().endOf('month').toDate(),
  ]);

  get dateRange$() {
    return this.dateRange$$.asObservable();
  }

  constructor(
    private afs: AngularFirestore,
    private auth: AuthenticationService
  ) {
    if (environment.useEmulators) {
      connectFirestoreEmulator(this.afs.firestore, 'localhost', 8080);
    }

    this.listsCollection = this.afs.collection<IList>('lists');

    this.boardsCollection$ = this.auth.user$.pipe(
      map((user) =>
        afs.collection<IBoard>('boards', (ref) =>
          ref.where('user', '==', user?.uid).orderBy('created')
        )
      ),
      tap((col) => (this.boardsCollection = col))
    );

    this.boards$ = this.boardsCollection$.pipe(
      switchMap((col) => col.valueChanges({ idField: 'id' }))
    );
  }

  setDateRange$(value: [Date, Date]) {
    this.dateRange$$.next(value);
  }

  async addBoard({ title }: { title: string }) {
    const boardId = this.afs.createId();
    const user = await firstValueFrom(this.auth.user$);
    const created = firebase.firestore.FieldValue.serverTimestamp();
    const boardRef = await this.boardsCollection.add({
      id: boardId,
      user: (<firebase.User>user).uid,
      title,
      lists: [],
      created,
      summaryListCardTypesInOrder: [
        'totalIncome',
        'totalExpenses',
        'netIncome',
        'savingsTarget',
        'discretionaryIncome',
      ],
    });

    const defaultLists = [
      { title: 'Income', type: LIST_TYPES.Income },
      { title: 'Expense', type: LIST_TYPES.Expense },
    ];
    const listRefs = await Promise.all(
      defaultLists.map(this.addList.bind(this))
    );
    boardRef.update({ lists: listRefs });
    return boardRef;
  }

  getList(ref: DocumentReference<IList>) {
    return this.afs
      .doc<IList>(ref)
      .valueChanges({ idField: 'id' })
      .pipe(
        filter(Boolean),
        switchMap(this.getCards.bind(this))
      ) as Observable<IList>;
  }

  private getCards(list: IList) {
    return this.dateRange$.pipe(
      switchMap(([start, end]) => {
        if (list?.cards.length) {
          return this.afs
            .collection<ICard>(
              'cards',
              (ref) =>
                ref.where(
                  firebase.firestore.FieldPath.documentId(),
                  'in',
                  list?.cards.map((card) => card.id)
                )
              // todo figure this out
              // .orderBy('created')
              // .startAt(start)
              // .endAt(end)
            )
            .valueChanges({ idField: 'id' });
        }
        return of([]);
      }),
      map((cards) => ({ ...list, cards }))
    );

    // todo delete once figuring ☝️ out
    const docRefs = (<any>list).cards.map((cardRef: DocumentReference) =>
      this.afs.doc(cardRef).valueChanges({ idField: 'id' })
    );
    return combineLatest(docRefs).pipe(
      defaultIfEmpty([]),
      map((cards) => ({ ...list, cards }))
    );
  }

  getListDoc(ref: DocumentReference | string) {
    return this.afs.doc(<any>ref);
  }

  getLists(board: IBoard) {
    if (!board.lists.length) {
      return of(board);
    }

    return combineLatest(
      board.lists.map((list) => this.getList(<any>list))
    ).pipe(map((lists) => ({ ...board, lists })));
  }

  getBoard(id: string) {
    if (!id) throw new Error('Board id is required');

    const boardDoc = this.afs.doc<IBoard>('boards/' + id);
    const board$ = boardDoc.valueChanges({ idField: 'id' }).pipe(
      filter(Boolean),
      switchMap((board) => this.getLists(board)),
      map(this.getBoardWithAreListsEmpty.bind(this)),
      tap(this.getSummaryListCalculations.bind(this)),
      map(this.getSummaryListByBoard.bind(this))
    );

    return {
      boardDoc,
      board$,
    };
  }

  private getBoardWithAreListsEmpty(board: IBoard) {
    return {
      ...board,
      areListsEmpty: board.lists.every((list) => !list.cards.length),
    };
  }

  private getSummaryListByBoard(board: IBoard) {
    const summaryListIndex = this.getSummaryListIndex(board);
    const lists = [...board.lists];
    lists.splice(summaryListIndex, 0, this.createSummaryList(board));

    return {
      ...board,
      lists,
    };
  }

  deleteAssociatedLists(board: IBoard) {
    board.lists.forEach((list) => {
      list.cards.forEach((card) => {
        this.afs.doc('cards/' + card.id).delete();
      });
      this.afs.doc('lists/' + list.id).delete();
    });
  }

  updateList(list: { title: string; id: string }) {
    this.afs.doc('lists/' + list.id).update({
      title: list.title,
    });
  }

  addList({ title, type }: { title: string; type: LIST_OPERATORS }) {
    return this.listsCollection.add({
      title,
      type,
      cards: [],
      created: firebase.firestore.FieldValue.serverTimestamp() as Timestamp,
    });
  }

  async addCard({
    list,
    amount,
    title,
  }: {
    amount: string;
    list: IList;
    title: string;
  }) {
    const cardCollection = this.afs.collection('cards');
    const listDoc = this.afs.doc('lists/' + list.id);
    const cardRef = await cardCollection.add({
      title,
      amount,
      created: firebase.firestore.FieldValue.serverTimestamp(),
      list: listDoc.ref,
    });
    listDoc.update({
      cards: firebase.firestore.FieldValue.arrayUnion(cardRef),
    });
  }

  getListRef(id: string) {
    return this.afs.collection('lists').doc<IList>(id).ref;
  }

  updateCard(card: ICard) {
    this.getCardRef(<string>card.id).update({
      ...card,
    });
  }

  setLists(lists: IList[]) {
    const updates = lists
      .filter((list) => list.type !== LIST_TYPES.Summary)
      .map((list) => {
        const doc = this.getListDoc(`lists/${list.id}`);
        const cards = list.cards.map((card) =>
          this.getCardRef(card.id as string)
        );
        return doc.update({ cards });
      });
    this.afs.firestore.runTransaction(() => {
      return Promise.all(updates);
    });
  }

  deleteCard(card: ICard, list: IList) {
    this.getCardRef(<string>card.id).delete();

    const cards = list.cards.filter((c) => c.id !== card.id);
    return this.afs
      .doc<Partial<IList>>('lists/' + list.id)
      .set({ cards }, { merge: true });
  }

  private createSummaryList(board: IBoard): IList {
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

  private getSummaryListIndex(board: IBoard) {
    return [null, undefined].includes(<any>board.summaryListIndex)
      ? board.lists.length
      : (board.summaryListIndex as number);
  }

  private getNetIncomeAmount(board: IBoard): string {
    const { totalIncome, totalExpenses } =
      this.boardIdToListsTotals[board.id as string];

    return (totalIncome - totalExpenses).toFixed(2);
  }

  private createNetIncomeCard(board: IBoard): ICard {
    return {
      id: 'netIncome',
      title: 'Net Income',
      amount: this.getNetIncomeAmount(board),
      disableDrag: false,
    };
  }

  private createSavingsTargetCard(board: IBoard): ICard {
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

  private createDiscretionaryIncomeCard(board: IBoard): ICard {
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

  private createTotalIncomeCard(board: IBoard): ICard {
    return {
      id: 'totalIncome',
      title: 'Total Income',
      amount: this.getTotalIncome(board).toFixed(2),
    };
  }

  private createTotalExpenseCard(board: IBoard): ICard {
    return {
      id: 'totalExpenses',
      title: 'Total Expenses',
      amount: this.getTotalExpenses(board).toFixed(2),
    };
  }

  private getSummaryListCalculations(board: IBoard) {
    this.boardIdToListsTotals = {
      [board.id as string]: {
        totalIncome: this.getTotalIncome(board),
        totalExpenses: this.getTotalExpenses(board),
      },
    };
  }

  getTotalIncome(board: IBoard) {
    return this.getListTotalByType({ board, type: LIST_TYPES.Income });
  }

  private getTotalExpenses(board: IBoard) {
    return this.getListTotalByType({ board, type: LIST_TYPES.Expense });
  }

  private getSavingsTarget(board: IBoard) {
    return +this.getNetIncomeAmount(board) * 0.2;
  }

  getListTotalByType({ type, board }: { type: LIST_OPERATORS; board: IBoard }) {
    return board.lists
      .filter((list) => list.type === type)
      .reduce((acc, list) => acc + this.calculateListTotal(list), 0);
  }

  calculateListTotal(list: IList) {
    return list.cards.reduce((acc, card) => acc + +(card.amount || 0), 0);
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

  private getCardRef(id: string) {
    return this.afs.doc('cards/' + id).ref;
  }

  deleteListCards(list: IList) {
    list.cards.forEach((card) => {
      this.getCardRef(<string>card.id).delete();
    });
  }
}
