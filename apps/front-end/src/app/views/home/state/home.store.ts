import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { Board } from '../../board/state/board.model';

export interface HomeState {
  boards: Board[];
}

export function createHomeState() {
  return {
    boards: [],
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'home' })
export class HomeStore extends Store<HomeState> {
  constructor() {
    super(createHomeState());
  }
}
