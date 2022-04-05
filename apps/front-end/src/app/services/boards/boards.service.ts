import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
} from '@angular/fire/compat/firestore';
import {
  BehaviorSubject,
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
import {
  ICard,
  List,
  SummaryListCardType,
} from '../../views/board/state/types';
import Timestamp = firebase.firestore.Timestamp;
import { Board } from '../../views/board/state/board.model';

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
  private boardsCollection: AngularFirestoreCollection<Board>;
  private listsCollection: AngularFirestoreCollection<List>;
  private boardsCollection$: Observable<AngularFirestoreCollection<Board>>;
  boards$: Observable<Board[]>;
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
    this.listsCollection = this.afs.collection<List>('lists');

    this.boardsCollection$ = this.auth.user$.pipe(
      map((user) =>
        afs.collection<Board>('boards', (ref) =>
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
    const docRefs = (<any>list).cards.map((cardRef: DocumentReference) =>
      this.afs.doc(cardRef).valueChanges({ idField: 'id' })
    );

    return combineLatest(docRefs).pipe(
      defaultIfEmpty([] as any),
      switchMap((cards: ICard[]) =>
        this.dateRange$.pipe(
          map(([start, end]) => ({
            ...list,
            cards: this.filterCardsByDateRange(cards, start, end),
          }))
        )
      )
    );
  }

  private filterCardsByDateRange(cards: ICard[], start: Date, end: Date) {
    return cards.filter(
      (card) =>
        card.created &&
        card.created.toDate().getTime() >= start.getTime() &&
        card.created.toDate().getTime() <= end.getTime()
    );
  }

  getListDoc(ref: DocumentReference | string) {
    return this.afs.doc(<any>ref);
  }

  getLists(board: Board) {
    if (!board.lists.length) {
      return of(board);
    }

    return combineLatest(
      board.lists.map((list) => this.getList(<any>list))
    ).pipe(map((lists) => ({ ...board, lists })));
  }

  getBoard(id: string) {
    if (!id) throw new Error('Board id is required');

    const boardDoc = this.afs.doc<Board>('boards/' + id);
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

  private getBoardWithAreListsEmpty(board: Board) {
    return {
      ...board,
      areListsEmpty: board.lists.every((list) => !list.cards.length),
    };
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

  deleteAssociatedLists(board: Board) {
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
    list: List;
    title: string;
  }) {
    const cardCollection = this.afs.collection('cards');
    const listDoc = this.afs.doc('lists/' + list.id);
    const cardRef = await cardCollection.add({
      title,
      amount,
      created: firebase.firestore.FieldValue.serverTimestamp(),
    });
    listDoc.update({
      cards: firebase.firestore.FieldValue.arrayUnion(cardRef),
    });
  }

  getListRef(id: string) {
    return this.afs.collection('lists').doc<List>(id).ref;
  }

  updateCard(card: ICard) {
    this.getCardRef(<string>card.id).update({
      ...card,
    });
  }

  setLists(lists: List[]) {
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

  deleteCard(card: ICard, list: List) {
    this.getCardRef(<string>card.id).delete();

    const cards = list.cards.filter((c) => c.id !== card.id);
    return this.afs
      .doc<Partial<List>>('lists/' + list.id)
      .set({ cards }, { merge: true });
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

  private getSummaryListIndex(board: Board) {
    return [null, undefined].includes(<any>board.summaryListIndex)
      ? board.lists.length
      : (board.summaryListIndex as number);
  }

  private getNetIncomeAmount(board: Board): string {
    const { totalIncome, totalExpenses } =
      this.boardIdToListsTotals[board.id as string];

    return (totalIncome - totalExpenses).toFixed(2);
  }

  private createNetIncomeCard(board: Board): ICard {
    return {
      id: 'netIncome',
      title: 'Net Income',
      amount: this.getNetIncomeAmount(board),
      disableDrag: false,
    };
  }

  private createSavingsTargetCard(board: Board): ICard {
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

  private createDiscretionaryIncomeCard(board: Board): ICard {
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

  private createTotalIncomeCard(board: Board): ICard {
    return {
      id: 'totalIncome',
      title: 'Total Income',
      amount: this.getTotalIncome(board).toFixed(2),
    };
  }

  private createTotalExpenseCard(board: Board): ICard {
    return {
      id: 'totalExpenses',
      title: 'Total Expenses',
      amount: this.getTotalExpenses(board).toFixed(2),
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

  private getSavingsTarget(board: Board) {
    return +this.getNetIncomeAmount(board) * 0.2;
  }

  getListTotalByType({ type, board }: { type: LIST_OPERATORS; board: Board }) {
    return board.lists
      .filter((list) => list.type === type)
      .reduce((acc, list) => acc + this.calculateListTotal(list), 0);
  }

  calculateListTotal(list: List) {
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

  deleteListCards(list: List) {
    list.cards.forEach((card) => {
      this.getCardRef(<string>card.id).delete();
    });
  }
}
