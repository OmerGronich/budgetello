import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsyncAutofocusDirective } from './async-autofocus.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [AsyncAutofocusDirective],
  exports: [AsyncAutofocusDirective],
})
export class AsyncAutofocusModule {}
