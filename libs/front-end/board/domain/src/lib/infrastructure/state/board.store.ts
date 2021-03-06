import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { Board } from '@budgetello/front-end-shared-domain';

export interface BoardState {
  board: Board | null;
}

const initialState: BoardState = {
  board: null,
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'board' })
export class BoardStore extends Store<BoardState> {
  constructor() {
    super(initialState);
  }
}
