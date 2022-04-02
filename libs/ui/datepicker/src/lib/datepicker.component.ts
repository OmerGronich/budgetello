import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import dayjs from 'dayjs';

@Component({
  selector: 'budgetello-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
})
export class DatepickerComponent {
  @Input() date: Date[] = [
    dayjs().startOf('month').toDate(),
    dayjs().endOf('month').toDate(),
  ];
  @Output() dateSelected = new EventEmitter<[Date, Date]>();

  dateFormCtrl = new FormControl(this.date, [Validators.required]);
}
