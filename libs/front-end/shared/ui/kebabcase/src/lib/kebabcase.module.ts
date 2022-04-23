import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KebabcasePipe } from './kebabcase.pipe';

@NgModule({
  declarations: [KebabcasePipe],
  imports: [CommonModule],
  exports: [KebabcasePipe],
})
export class KebabcaseModule {}
