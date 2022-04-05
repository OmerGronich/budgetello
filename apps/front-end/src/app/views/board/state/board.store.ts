import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { Board } from './board.model';

export interface BoardState {
  boards: Board[];
}

const initialState: BoardState = {
  boards: [],
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'board' })
export class BoardStore extends Store<BoardState> {
  constructor() {
    super(initialState);
  }
}
