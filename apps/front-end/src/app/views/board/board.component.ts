import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LIST_OPERATORS_TO_PROPS } from '../../constants';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { List } from './state/types';
import { BoardService } from './state/board.service';
import { BoardQuery } from './state/board.query';
import { Board } from './state/board.model';

@Component({
  selector: 'budgetello-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardComponent implements OnInit, OnDestroy {
  board$ = this.boardQuery.selectBoard$;

  get boardId() {
    return this.route.snapshot.paramMap.get('id') || '';
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private boardService: BoardService,
    private boardQuery: BoardQuery
  ) {}

  ngOnInit() {
    this.boardService.init();
  }

  ngOnDestroy(): void {
    this.boardService.destroy();
  }

  updateBoardTitle($event: { title: string }) {
    this.boardService.updateBoardTitle($event.title);
  }

  deleteBoard(board: Board) {
    this.boardService.deleteBoard();
    this.router.navigate(['/']);
  }

  updateListTitle($event: { title: string; id: string }) {
    this.boardService.updateListTitle($event);
  }

  async addList({
    title,
    type,
  }: {
    $event?: Event | string;
    title: any;
    type: any;
  }) {
    this.boardService.addList({ title, type });
  }

  getListCssClass(list: List) {
    return `list-${LIST_OPERATORS_TO_PROPS[list.type]?.toLowerCase()}`;
  }

  createCard(
    {
      submitEvent,
      cardTitle,
      amount,
    }: {
      cardTitle: string;
      amount: string;
      submitEvent: SubmitEvent;
    },
    list: List
  ) {
    submitEvent.preventDefault();

    this.boardService.addCard({
      list,
      title: cardTitle,
      amount: amount,
    });
  }

  reorderLists(lists: List[]) {
    this.boardService.setListsOrder(lists);
  }

  reorderCards({ lists, event }: { lists: any[]; event: CdkDragDrop<any> }) {
    this.boardService.setCardsOrder({ lists, event });
  }

  deleteList(list: List) {
    this.boardService.deleteList(list);
  }
}
