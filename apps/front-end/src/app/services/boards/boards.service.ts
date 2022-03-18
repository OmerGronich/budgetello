import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { map, Observable, switchMap, tap } from 'rxjs';
import { connectFirestoreEmulator } from '@angular/fire/firestore';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../authentication/authentication.service';

export interface IBoard {
  title: string;
  lists: string[];
  user: string;
}

@Injectable({
  providedIn: 'root',
})
export class BoardsService {
  private boardsCollection: AngularFirestoreCollection<IBoard>;
  private boardsCollection$: Observable<AngularFirestoreCollection<IBoard>>;
  boards$: Observable<IBoard[]>;

  constructor(
    private afs: AngularFirestore,
    private auth: AuthenticationService
  ) {
    if (environment.useEmulators) {
      connectFirestoreEmulator(this.afs.firestore, 'localhost', 8080);
    }

    this.boardsCollection$ = this.auth.user$.pipe(
      map((user) =>
        afs.collection<IBoard>('boards', (ref) =>
          ref.where('user', '==', user?.uid)
        )
      ),
      tap((col) => (this.boardsCollection = col))
    );

    this.boards$ = this.boardsCollection$.pipe(
      switchMap((col) => col.valueChanges())
    );
  }

  addBoard(board: IBoard) {
    this.boardsCollection.add(board);
  }
}
