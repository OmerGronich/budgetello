import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
} from '@angular/fire/compat/firestore';
import {
  combineLatest,
  filter,
  forkJoin,
  from,
  map,
  Observable,
  switchMap,
  tap,
} from 'rxjs';
import { connectFirestoreEmulator } from '@angular/fire/firestore';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../authentication/authentication.service';
import { IKanbanBoardListDto } from '@budgetello/ui/kanban-board';
import { ActivatedRoute } from '@angular/router';

export interface IBoardDto {
  id?: string;
  title: string;
  lists: DocumentReference[];
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
          ref.where('user', '==', user?.uid)
        )
      ),
      tap((col) => (this.boardsCollection = col))
    );

    this.boards$ = this.boardsCollection$.pipe(
      switchMap((col) =>
        col.snapshotChanges().pipe(
          map((snapshots) =>
            snapshots.map((snapshot) => {
              const data = snapshot.payload.doc.data();
              const id = snapshot.payload.doc.id;
              return { id, ...data };
            })
          )
        )
      )
    );
  }

  addBoard(board: IBoardDto) {
    this.boardsCollection.add(board);
  }

  getList(ref: DocumentReference) {
    return this.afs.doc(ref).snapshotChanges();
  }

  getLists(board: IBoardDto) {
    return combineLatest(board.lists.map((list) => this.getList(list))).pipe(
      map((snapshots) => {
        const lists = snapshots.map((snapshot: any) => {
          const data = snapshot.payload.data();
          const id = snapshot.payload.id;
          return { ...data, id };
        });

        return { ...board, lists };
      })
    );
  }
}
