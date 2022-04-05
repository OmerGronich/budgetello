import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Inplace } from 'primeng/inplace';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import { BoardService } from '../../views/board/state/board.service';

@Component({
  selector: 'budgetello-board-header',
  templateUrl: './board-header.component.html',
  styleUrls: ['./board-header.component.scss'],
  providers: [ConfirmationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardHeaderComponent implements OnInit {
  @Input() boardTitle: string;
  @Output() boardTitleUpdated = new EventEmitter<{ title: string }>();
  @Output() boardDeleted = new EventEmitter<void>();

  boardTitleFormControl = new FormControl('', [Validators.required]);

  constructor(
    private confirmationService: ConfirmationService,
    public boardService: BoardService
  ) {}

  ngOnInit(): void {
    this.boardTitleFormControl.setValue(this.boardTitle);
  }

  onBoardTitleEdit({ boardNameTemplate }: { boardNameTemplate: Inplace }) {
    if (!this.boardTitleFormControl.valid) {
      return;
    }
    this.boardTitleUpdated.emit({ title: this.boardTitleFormControl.value });
    boardNameTemplate.deactivate();
  }

  onBoardTitleEditCancel({
    boardNameTemplate,
  }: {
    boardNameTemplate: Inplace;
  }) {
    this.boardTitleFormControl.setValue(this.boardTitle);
    boardNameTemplate.deactivate();
  }

  confirm() {
    this.confirmationService.confirm({
      message: 'Do you want to delete this board?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.boardDeleted.emit();
        this.confirmationService.close();
      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
          case ConfirmEventType.CANCEL:
            this.confirmationService.close();
            break;
        }
      },
    });
  }

  onDateSelected($event: [Date, Date]) {
    this.boardService.setDateRange$($event);
  }
}
