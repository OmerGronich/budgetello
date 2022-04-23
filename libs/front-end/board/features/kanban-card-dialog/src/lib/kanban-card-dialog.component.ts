import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Card, List, LIST_TYPES } from '@budgetello/front-end-shared-domain';
import { BoardFacade } from '@budgetello/front-end/board/domain';

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
    private boardFacade: BoardFacade
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
      this.boardFacade.updateCard(
        { ...this.card, shares: this.stockFormGroup.value.shares },
        this.list
      );
    } else {
      this.boardFacade.updateCard(
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
    this.boardFacade.deleteCard(this.card, this.list);
  }
}
