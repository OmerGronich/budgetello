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
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { arrayUnion, connectFirestoreEmulator } from '@angular/fire/firestore';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../authentication/authentication.service';
import { LIST_OPERATORS } from '../../constants';
import firebase from 'firebase/compat/app';
import FieldValue = firebase.firestore.FieldValue;

export interface IList extends Partial<DocumentReference> {
  type: LIST_OPERATORS;
  id: string;
  title: string;
  cards: { title: string; amount: string; created?: unknown; id?: string }[];
  created: FieldValue;
}

export type IBoard = {
  id?: string;
  title: string;
  lists: IList[];
  user: string;
  created: FieldValue;
};

@Injectable({
  providedIn: 'root',
})
export class BoardsService {
  private boardsCollection: AngularFirestoreCollection<IBoard>;
  private listsCollection: AngularFirestoreCollection<IList>;
  private boardsCollection$: Observable<AngularFirestoreCollection<IBoard>>;
  boards$: Observable<IBoard[]>;

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

  getLists(board: IBoard) {
    return combineLatest(
      board.lists.map((list) => this.getList(<DocumentReference>list))
    ).pipe(
      startWith([]),
      map((lists) => ({ ...board, lists }))
    );
  }

  getBoard(id: string) {
    if (!id) throw new Error('Board id is required');

    const boardDoc = this.afs.doc<IBoard>('boards/' + id);
    const board$ = boardDoc
      .valueChanges({ idField: 'id' })
      .pipe(filter(Boolean), switchMap(this.getLists.bind(this)));

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
}
