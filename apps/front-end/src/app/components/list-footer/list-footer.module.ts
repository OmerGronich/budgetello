import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListFooterComponent } from './list-footer.component';
import { ButtonModule } from 'primeng/button';
import { UiAsyncAutofocusModule } from '@budgetello/ui/async-autofocus';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [ListFooterComponent],
  exports: [ListFooterComponent],
  imports: [
    CommonModule,
    ButtonModule,
    UiAsyncAutofocusModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    TooltipModule,
  ],
})
export class ListFooterModule {}
