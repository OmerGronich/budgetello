import { Component } from '@angular/core';
import {
  BoardsService,
  IBoard,
  IBoardDto,
} from '../../services/boards/boards.service';
import { ActivatedRoute } from '@angular/router';
import {
  combineLatest,
  filter,
  forkJoin,
  map,
  Observable,
  switchMap,
  tap,
} from 'rxjs';

@Component({
  selector: 'budgetello-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  public board$: Observable<IBoard>;
  constructor(
    private boardsService: BoardsService,
    private route: ActivatedRoute
  ) {
    this.board$ = this.boardsService.boards$.pipe(
      map((boards) =>
        boards.find(
          (board: IBoardDto) =>
            board.id === this.route.snapshot.paramMap.get('id')
        )
      ),
      filter(Boolean),
      switchMap((board) =>
        combineLatest(
          board.lists.map((list) => this.boardsService.getList(list))
        ).pipe(
          map((snapshots) => {
            const lists = snapshots.map((snapshot: any) => {
              const data = snapshot.payload.data();
              const id = snapshot.payload.id;
              return { ...data, id };
            });

            return { ...board, lists };
          })
        )
      )
    );
  }
}
