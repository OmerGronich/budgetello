import { Injectable } from '@angular/core';
import { BoardState, BoardStore } from './board.store';
import { Query } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class BoardQuery extends Query<BoardState> {
  selectBoard$ = this.select('board');

  constructor(protected override store: BoardStore) {
    super(store);
  }
}
