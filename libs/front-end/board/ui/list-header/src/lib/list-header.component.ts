import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ConfirmationService, ConfirmEventType } from 'primeng/api';
import {
  List,
  LIST_OPERATORS,
  LIST_TYPES,
} from '@budgetello/front-end-shared-domain';

@Component({
  selector: 'budgetello-list-header',
  templateUrl: './list-header.component.html',
  styleUrls: ['./list-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class ListHeaderComponent implements OnInit {
  @Input() list: List;
  @Input() type: LIST_OPERATORS;
  isEditingTitle = false;
  listTitleFormControl = new FormControl('', Validators.required);
  @Output() listTitleChanged = new EventEmitter();
  @Output() listDeleted = new EventEmitter();

  optimisticListTitle: string;

  get isSummary() {
    return this.type === LIST_TYPES.Summary;
  }

  constructor(private confirmationService: ConfirmationService) {}

  ngOnInit(): void {
    this.optimisticListTitle = this.list.title;
    this.listTitleFormControl.setValue(this.list.title);
  }

  cancelEdit($event?: Event) {
    this.isEditingTitle = false;
    this.listTitleFormControl.setValue(this.list.title);
  }

  startEditing() {
    this.isEditingTitle = true;
  }

  submitListTitleEdit($event: any) {
    this.optimisticListTitle = this.listTitleFormControl.value;
    this.listTitleChanged.emit({ title: this.listTitleFormControl.value });
    this.isEditingTitle = false;
  }

  deleteList() {
    this.confirmationService.confirm({
      message: 'Do you want to delete this list?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.listDeleted.emit(this.list);
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
}
