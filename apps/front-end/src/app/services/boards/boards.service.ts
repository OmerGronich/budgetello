import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
} from '@angular/fire/compat/firestore';
import {
  combineLatest,
  filter,
  firstValueFrom,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { arrayUnion, connectFirestoreEmulator } from '@angular/fire/firestore';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../authentication/authentication.service';
import { LIST_OPERATORS, LIST_TYPES } from '../../constants';
import firebase from 'firebase/compat/app';
import FieldValue = firebase.firestore.FieldValue;

export interface ICard {
  title: string;
  amount: string;
  created?: FieldValue;
  id?: string;
  disableDrag?: boolean;
}

export interface IList extends Partial<DocumentReference> {
  type: LIST_OPERATORS;
  id: string;
  title: string;
  cards: ICard[];
  created?: FieldValue;
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
    totalExpense: number;
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
  runTransaction: AngularFirestore['firestore']['runTransaction'];
  private boardIdToListsTotals: BoardIdToListsTotals;

  constructor(
    private afs: AngularFirestore,
    private auth: AuthenticationService
  ) {
    this.runTransaction = this.afs.firestore.runTransaction;

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

  async addBoard({ title }: { title: string }) {
    const id = this.afs.createId();
    const user = await firstValueFrom(this.auth.user$);
    const created = firebase.firestore.FieldValue.serverTimestamp();
    this.boardsCollection.add({
      id,
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
  }

  getList(ref: DocumentReference) {
    return this.afs
      .doc(ref)
      .valueChanges({ idField: 'id' }) as Observable<IList>;
  }

  getListDoc(ref: DocumentReference | string) {
    return this.afs.doc(<any>ref);
  }

  getLists(board: IBoard) {
    if (!board.lists.length) {
      return of(board);
    }

    return combineLatest(
      board.lists.map((list) => this.getList(<DocumentReference>list))
    ).pipe(map((lists) => ({ ...board, lists })));
  }

  getBoard(id: string) {
    if (!id) throw new Error('Board id is required');

    const boardDoc = this.afs.doc<IBoard>('boards/' + id);
    const board$ = boardDoc.valueChanges({ idField: 'id' }).pipe(
      filter(Boolean),
      switchMap((board) => this.getLists(board)),
      map((board) => ({
        ...board,
        areListsEmpty: board.lists.every((list) => !list.cards.length),
      })),
      tap(this.getSummaryListCalculations.bind(this)),
      map((board) => ({
        ...board,
        lists: this.createSummaryList(board),
      }))
    );

    return {
      boardDoc,
      board$,
    };
  }

  deleteAssociatedLists(board: IBoard) {
    board.lists.forEach((list) => {
      this.afs.doc('lists/' + list.id).delete();
    });
  }

  updateList(list: { title: string; id: string }) {
    this.afs.doc('lists/' + list.id).update({
      title: list.title,
    });
  }

  addList({ title, type }: { title: string; type: LIST_OPERATORS }) {
    const id = this.afs.createId();
    return this.listsCollection.add({
      id,
      title,
      type,
      cards: [],
      created: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }

  createCard({
    list,
    amount,
    title,
  }: {
    amount: string;
    list: IList;
    title: string;
  }) {
    const listDoc = this.afs.doc('lists/' + list.id);
    listDoc
      .update({
        cards: arrayUnion({
          title,
          amount,
          id: this.afs.createId(),
        }),
      })
      .catch(console.error);
  }

  getListRef(id: string) {
    return this.afs.collection('lists').doc<IList>(id).ref;
  }

  setLists(lists: IList[]) {
    const updates = lists
      .filter((list) => list.type !== LIST_TYPES.Summary)
      .map((list) => {
        const doc = this.getListDoc(`lists/${list.id}`);
        return doc.update({ cards: list.cards });
      });
    this.afs.firestore.runTransaction(() => {
      return Promise.all(updates);
    });
  }

  updateCard(card: ICard, list: IList) {
    const newCards = list.cards.map((c) => {
      if (c.id === card.id) {
        return card;
      }

      return c;
    });
    return this.afs
      .doc<Partial<IList>>('lists/' + list.id)
      .set({ cards: newCards }, { merge: true });
  }

  deleteCard(card: ICard, list: IList) {
    const newCards = list.cards.filter((c) => c.id !== card.id);
    return this.afs
      .doc<Partial<IList>>('lists/' + list.id)
      .set({ cards: newCards }, { merge: true });
  }

  private createSummaryList(board: IBoard): IList[] {
    const summaryList = {
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
    const lists = [...board.lists];
    const summaryListIndex = [null, undefined].includes(
      <any>board.summaryListIndex
    )
      ? board.lists.length
      : (board.summaryListIndex as number);
    lists.splice(summaryListIndex, 0, summaryList);
    return lists;
  }

  private getNetIncomeAmount(board: IBoard): string {
    const { totalIncome, totalExpense } =
      this.boardIdToListsTotals[board.id as string];

    return (totalIncome - totalExpense).toFixed(2);
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
    return {
      id: 'savingsTarget',
      title: 'Savings Target (20%)',
      amount: !this.boardIdToListsTotals[board.id as string].totalIncome
        ? '0'
        : this.getSavingsTarget(board).toFixed(2),
    };
  }

  private createDiscretionaryIncomeCard(board: IBoard): ICard {
    const netIncomeAmount = +this.getNetIncomeAmount(board);
    const amount = !this.boardIdToListsTotals[board.id as string].totalIncome
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
      amount: this.getTotalExpense(board).toFixed(2),
    };
  }

  private getSummaryListCalculations(board: IBoard) {
    this.boardIdToListsTotals = {
      [board.id as string]: {
        totalIncome: this.getTotalIncome(board),
        totalExpense: this.getTotalExpense(board),
      },
    };
  }

  getTotalIncome(board: IBoard) {
    return this.getListTotalByType({ board, type: LIST_TYPES.Income });
  }

  private getTotalExpense(board: IBoard) {
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
    return list.cards.reduce((acc, card) => acc + parseFloat(card.amount), 0);
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
}
