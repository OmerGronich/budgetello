import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Card, List } from '../../views/board/state/types';
import { BoardService } from '../../views/board/state/board.service';
import { LIST_TYPES } from '../../constants';

@Component({
  selector: 'budgetello-kanban-card-dialog',
  templateUrl: './kanban-card-dialog.component.html',
  styleUrls: ['./kanban-card-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanCardDialogComponent {
  get card(): Card {
    return this.config.data.card;
  }

  get list(): List {
    return this.config.data.list;
  }

  incomeExpenseFormGroup: FormGroup;
  stockFormGroup: FormGroup;
  listTypes = LIST_TYPES;

  constructor(
    private fb: FormBuilder,
    private config: DynamicDialogConfig,
    private boardService: BoardService
  ) {
    this.incomeExpenseFormGroup = this.fb.group({
      title: new FormControl(this.card.title),
      amount: new FormControl(this.card.amount),
    });

    this.stockFormGroup = this.fb.group({
      displayName: new FormControl({
        value: this.card.displayName,
        disabled: true,
      }),
      shares: new FormControl(this.card.shares),
    });
  }

  saveCard() {
    if (this.list.type === this.listTypes.Stock) {
      this.boardService.updateCard(
        { ...this.card, shares: this.stockFormGroup.value.shares },
        this.list
      );
    } else {
      this.boardService.updateCard(
        {
          ...this.card,
          title: this.incomeExpenseFormGroup.value.title,
          amount: this.incomeExpenseFormGroup.value.amount,
        },
        this.list
      );
    }
  }

  deleteCard() {
    this.boardService.deleteCard(this.card, this.list);
  }
}
