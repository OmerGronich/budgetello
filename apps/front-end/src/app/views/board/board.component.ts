import { Component } from '@angular/core';
import {
  BoardsService,
  IBoard,
  IBoardDto,
} from '../../services/boards/boards.service';
import { ActivatedRoute } from '@angular/router';
import { filter, map, Observable, switchMap } from 'rxjs';

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
      map(this.findBoardByRouteParams.bind(this)),
      filter(Boolean),
      switchMap(this.boardsService.getLists.bind(this.boardsService))
    );
  }

  findBoardByRouteParams(boards: IBoardDto[]): IBoardDto | undefined {
    return boards.find(
      (board: IBoardDto) => board.id === this.route.snapshot.paramMap.get('id')
    );
  }
}
