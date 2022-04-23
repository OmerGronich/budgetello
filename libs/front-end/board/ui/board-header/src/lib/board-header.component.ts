import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Inplace } from 'primeng/inplace';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';

@Component({
  selector: 'budgetello-board-header',
  templateUrl: './board-header.component.html',
  styleUrls: ['./board-header.component.scss'],
  providers: [ConfirmationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardHeaderComponent implements OnInit, OnChanges {
  @Input() dateRange: Date[] | null;
  @Input() boardTitle: string;
  @Output() boardTitleUpdated = new EventEmitter<{ title: string }>();
  @Output() boardDeleted = new EventEmitter<void>();
  @Output() dateSelected = new EventEmitter<Date[]>();

  boardTitleFormControl = new FormControl('', [Validators.required]);

  constructor(private confirmationService: ConfirmationService) {}

  ngOnInit(): void {
    this.boardTitleFormControl.setValue(this.boardTitle);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['boardTitle']) {
      this.boardTitleFormControl.setValue(changes['boardTitle']?.currentValue);
    }
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
    this.dateSelected.emit($event);
  }
}
