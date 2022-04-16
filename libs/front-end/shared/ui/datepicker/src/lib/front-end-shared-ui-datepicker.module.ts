import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatepickerComponent } from './datepicker.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, CalendarModule],
  declarations: [DatepickerComponent],
  exports: [DatepickerComponent],
})
export class FrontEndSharedUiDatepickerModule {}
