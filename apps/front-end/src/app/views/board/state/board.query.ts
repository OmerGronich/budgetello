import { Injectable } from '@angular/core';
import { BoardState, BoardStore } from './board.store';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class BoardQuery extends Query<BoardState> {
  constructor(protected override store: BoardStore) {
    super(store);
  }
}
