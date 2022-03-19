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
import { connectFirestoreEmulator } from '@angular/fire/firestore';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../authentication/authentication.service';
import { IKanbanBoardListDto } from '@budgetello/ui/kanban-board';
import { LIST_OPERATORS } from '../../constants';
import firebase from 'firebase/compat/app';
import FieldValue = firebase.firestore.FieldValue;

export interface IList {
  type: LIST_OPERATORS;
  id: string;
  title: string;
  cards: DocumentReference[];
}

export interface IBoardDto {
  id?: string;
  title: string;
  lists: DocumentReference[];
  created: FieldValue;
  user: string;
}

export type IBoard = {
  id?: string;
  title: string;
  lists: IKanbanBoardListDto[];
  user: string;
};

@Injectable({
  providedIn: 'root',
})
export class BoardsService {
  private boardsCollection: AngularFirestoreCollection<IBoardDto>;
  private boardsCollection$: Observable<AngularFirestoreCollection<IBoardDto>>;
  boards$: Observable<IBoardDto[]>;

  constructor(
    private afs: AngularFirestore,
    private auth: AuthenticationService
  ) {
    if (environment.useEmulators) {
      connectFirestoreEmulator(this.afs.firestore, 'localhost', 8080);
    }

    this.boardsCollection$ = this.auth.user$.pipe(
      map((user) =>
        afs.collection<IBoardDto>('boards', (ref) =>
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

  getLists(board: IBoardDto) {
    return combineLatest(board.lists.map((list) => this.getList(list))).pipe(
      startWith([]),
      map((lists) => ({ ...board, lists }))
    );
  }

  getBoard(id: string) {
    if (!id) throw new Error('Board id is required');

    const boardDoc = this.afs.doc<IBoardDto>('boards/' + id);
    const board$ = boardDoc
      .valueChanges({ idField: 'id' })
      .pipe(filter(Boolean), switchMap(this.getLists.bind(this)));

    return {
      boardDoc,
      board$,
    };
  }
}
