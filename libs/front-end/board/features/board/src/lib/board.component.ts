import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import {
  Board,
  List,
  LIST_OPERATORS_TO_PROPS,
} from '@budgetello/front-end-shared-domain';
import { BoardFacade } from '@budgetello/front-end/board/domain';
import { Observable } from 'rxjs';

@Component({
  selector: 'budgetello-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardComponent implements OnInit, OnDestroy {
  board$ = this.boardFacade.board$;
  dateRange$: Observable<Date[]> = this.boardFacade.dateRange$;

  constructor(private router: Router, private boardFacade: BoardFacade) {}

  ngOnInit() {
    this.boardFacade.init();
  }

  ngOnDestroy(): void {
    this.boardFacade.destroy();
  }

  updateBoardTitle($event: { title: string }) {
    this.boardFacade.updateBoardTitle($event.title);
  }

  deleteBoard(board: Board) {
    this.boardFacade.deleteBoard();
    this.router.navigate(['/']);
  }

  updateListTitle($event: { title: string; id: string }) {
    this.boardFacade.updateListTitle($event);
  }

  async addList({
    title,
    type,
  }: {
    $event?: Event | string;
    title: any;
    type: any;
  }) {
    this.boardFacade.addList({ title, type });
  }

  getListCssClass(list: List) {
    return `list-${LIST_OPERATORS_TO_PROPS[list.type]?.toLowerCase()}`;
  }

  createIncomeExpenseCard(
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

    this.boardFacade.addIncomeExpenseCard({
      list,
      title: cardTitle,
      amount: amount,
    });
  }

  reorderLists(lists: List[]) {
    this.boardFacade.setListsOrder(lists);
  }

  reorderCards({ lists, event }: { lists: any[]; event: CdkDragDrop<any> }) {
    this.boardFacade.setCardsOrder({ lists, event });
  }

  deleteList(list: List) {
    this.boardFacade.deleteList(list);
  }

  createStockCard(
    {
      stockSymbol,
      shares,
      name,
      displayName,
    }: {
      submitEvent: SubmitEvent;
      stockSymbol: string;
      shares: number;
      name: string;
      displayName: string;
    },
    list: List
  ) {
    this.boardFacade.addStockCard({
      list,
      stockSymbol,
      shares,
      displayName,
      name,
    });
  }

  setDateRange($event: Date[]) {
    this.boardFacade.setDateRange$($event);
  }
}
