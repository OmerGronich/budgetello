import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'budgetello-add-list-form',
  templateUrl: './add-list-form.component.html',
  styleUrls: ['./add-list-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddListFormComponent implements OnDestroy {
  @Input() isCreatingList: boolean;
  addListTitleFormControl = new FormControl('', [Validators.required]);
  listTypeSelectorFormControl = new FormControl(null, [Validators.required]);
  @Output() listAdded = new EventEmitter();
  @Output() closeButtonClicked = new EventEmitter();

  ngOnDestroy(): void {
    this.reset();
  }

  reset() {
    this.addListTitleFormControl.reset();
    this.listTypeSelectorFormControl.reset();
  }

  handleAddListClick($event: MouseEvent) {
    if (
      this.addListTitleFormControl.invalid ||
      this.listTypeSelectorFormControl.invalid
    ) {
      this.listTypeSelectorFormControl.markAsDirty();
      this.addListTitleFormControl.markAsDirty();
      return;
    }
    this.listAdded.emit({
      event: $event,
      title: this.addListTitleFormControl.value,
      type: this.listTypeSelectorFormControl.value.value,
    });
    this.reset();
  }

  handleCancelClick($event: MouseEvent) {
    this.closeButtonClicked.emit($event);
    this.reset();
  }
}
