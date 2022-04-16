import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseInputDirective } from './base-input.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [BaseInputDirective],
  exports: [BaseInputDirective],
})
export class FrontEndSharedUiBaseInputModule {}
