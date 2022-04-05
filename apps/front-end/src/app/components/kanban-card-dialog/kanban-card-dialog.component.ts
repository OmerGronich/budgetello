import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Card, List } from '../../views/board/state/types';
import { BoardService } from '../../views/board/state/board.service';

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

  group: FormGroup;

  constructor(
    private fb: FormBuilder,
    private config: DynamicDialogConfig,
    private boardService: BoardService
  ) {
    this.group = this.fb.group({
      title: new FormControl(this.card.title),
      amount: new FormControl(this.card.amount),
    });
  }

  saveCard() {
    this.boardService.updateCard(
      {
        ...this.card,
        title: this.group.get('title')?.value,
        amount: this.group.get('amount')?.value,
      },
      this.list
    );
  }

  deleteCard() {
    this.boardService.deleteCard(this.card, this.list);
  }
}
