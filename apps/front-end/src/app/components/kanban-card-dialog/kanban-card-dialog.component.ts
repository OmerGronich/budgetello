import { ChangeDetectionStrategy, Component, Output } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import {
  BoardsService,
  ICard,
  IList,
} from '../../services/boards/boards.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'budgetello-kanban-card-dialog',
  templateUrl: './kanban-card-dialog.component.html',
  styleUrls: ['./kanban-card-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanCardDialogComponent {
  get card(): ICard {
    return this.config.data.card;
  }

  get list(): IList {
    return this.config.data.list;
  }

  group: FormGroup;

  constructor(
    private fb: FormBuilder,
    private config: DynamicDialogConfig,
    private boardService: BoardsService
  ) {
    this.group = this.fb.group({
      title: new FormControl(this.card.title),
      amount: new FormControl(this.card.amount),
    });
  }

  saveCard() {
    this.boardService.updateCard({
      ...this.card,
      title: this.group.get('title')?.value,
      amount: this.group.get('amount')?.value,
    });
  }

  deleteCard() {
    this.boardService.deleteCard(this.card, this.list);
  }
}
