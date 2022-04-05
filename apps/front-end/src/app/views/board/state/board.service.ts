import { Injectable } from '@angular/core';
import { BoardStore } from './board.store';

@Injectable({ providedIn: 'root' })
export class BoardService {
  constructor(private boardStore: BoardStore) {}
}
