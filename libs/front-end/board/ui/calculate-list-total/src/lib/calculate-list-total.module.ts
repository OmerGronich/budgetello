import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculateListTotalPipe } from './calculate-list-total.pipe';

@NgModule({
  declarations: [CalculateListTotalPipe],
  imports: [CommonModule],
  exports: [CalculateListTotalPipe],
})
export class CalculateListTotalModule {}
