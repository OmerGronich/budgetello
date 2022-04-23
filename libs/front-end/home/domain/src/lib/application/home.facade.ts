import { Injectable } from '@angular/core';
import { HomeStore } from '../infrastructure/state/home.store';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { firstValueFrom, Subscription, switchMap } from 'rxjs';
import { Timestamp } from '@angular/fire/firestore';
import firebase from 'firebase/compat/app';
import {
  AuthFacade,
  Board,
  List,
  LIST_OPERATORS,
  LIST_TYPES,
} from '@budgetello/front-end-shared-domain';
import { HomeQuery } from '../infrastructure/state/home.query';

@Injectable({ providedIn: 'root' })
export class HomeFacade {
  subscriptions: Subscription[] = [];
  boardsCollection = this.afs.collection<Board>('boards');
  listsCollection = this.afs.collection<List>('lists');
  boards$ = this.homeQuery.selectBoards$;

  constructor(
    private homeStore: HomeStore,
    private afs: AngularFirestore,
    private authFacade: AuthFacade,
    private homeQuery: HomeQuery
  ) {}

  init() {
    this.subscriptions.push(
      this.authFacade.user$
        .pipe(
          switchMap((user) =>
            this.afs
              .collection<Board>('boards', (ref) =>
                ref.where('user', '==', user?.uid).orderBy('created')
              )
              .valueChanges({ idField: 'id' })
          )
        )
        .subscribe((boards) => {
          this.homeStore.update((state) => ({ ...state, boards }));
        })
    );
  }

  destroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  async addBoard({ title }: { title: string }) {
    const boardId = this.afs.createId();
    const user = await firstValueFrom(this.authFacade.user$);
    const created = firebase.firestore.FieldValue.serverTimestamp();
    const newBoard: Board = {
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
    };
    const boardRef = await this.boardsCollection.add(newBoard);

    const defaultLists = [
      { title: 'Income', type: LIST_TYPES.Income },
      { title: 'Expense', type: LIST_TYPES.Expense },
    ];
    const listRefs = await Promise.all(
      defaultLists.map(this.createEmptyList.bind(this))
    );
    boardRef.update({ lists: listRefs });

    this.homeStore.update((state) => ({
      ...state,
      boards: [...state.boards, newBoard],
    }));

    return boardRef;
  }

  createEmptyList({ title, type }: { title: string; type: LIST_OPERATORS }) {
    return this.listsCollection.add({
      title,
      type,
      cards: [],
      created: firebase.firestore.FieldValue.serverTimestamp() as Timestamp,
    });
  }
}
