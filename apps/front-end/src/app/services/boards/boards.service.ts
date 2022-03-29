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
}

export type IBoard = {
  id?: string;
  title: string;
  lists: IList[];
  user: string;
  created: FieldValue;
  areListsEmpty?: boolean;
  summaryListIndex?: number;
};

@Injectable({
  providedIn: 'root',
})
export class BoardsService {
  private boardsCollection: AngularFirestoreCollection<IBoard>;
  private listsCollection: AngularFirestoreCollection<IList>;
  private boardsCollection$: Observable<AngularFirestoreCollection<IBoard>>;
  boards$: Observable<IBoard[]>;
  runTransaction: AngularFirestore['firestore']['runTransaction'];

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
      cards: board.areListsEmpty ? [] : [this.createNetIncomeCard(board)],
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
  private createNetIncomeCard(board: IBoard): ICard {
    const amount = board.lists
      .reduce((acc, list) => {
        if (list.type === LIST_TYPES.Income) {
          return (
            acc +
            list.cards.reduce((acc, card) => {
              return acc + parseFloat(card.amount);
            }, 0)
          );
        } else if (list.type === LIST_TYPES.Expense) {
          return (
            acc -
            list.cards.reduce((acc, card) => {
              return acc + parseFloat(card.amount);
            }, 0)
          );
        } else if (list.type === LIST_TYPES.Split) {
          throw new Error('Not implemented calculations for split lists');
        }

        return 0;
      }, 0)
      .toFixed(2);

    return {
      id: 'net-income',
      title: 'Net Income',
      amount,
      disableDrag: true,
    };
  }
}
