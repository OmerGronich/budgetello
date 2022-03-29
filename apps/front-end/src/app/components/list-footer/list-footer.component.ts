import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { LIST_OPERATORS, LIST_TYPES } from '../../constants';

@Component({
  selector: 'budgetello-list-footer',
  templateUrl: './list-footer.component.html',
  styleUrls: ['./list-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListFooterComponent {
  @Input() total: number;
  @Input() type: LIST_OPERATORS;

  isCreatingCard = false;
  @Output() submitNewCard = new EventEmitter<{
    submitEvent: SubmitEvent;
    cardTitle: string;
    amount: string;
  }>();

  form: FormGroup;

  get isSummary() {
    return this.type === LIST_TYPES.Summary;
  }

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      cardTitle: new FormControl('', [Validators.required]),
      amount: new FormControl('', [Validators.required]),
    });
  }
  stopCreatingCard($event: Event) {
    this.isCreatingCard = false;
    this.form.reset();
  }

  submit($event: SubmitEvent) {
    this.submitNewCard.emit({
      submitEvent: $event,
      cardTitle: this.form.controls['cardTitle'].value,
      amount: this.form.controls['amount'].value,
    });
    this.isCreatingCard = false;
    this.form.reset();
  }
}
