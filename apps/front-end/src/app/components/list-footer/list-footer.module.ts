import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListFooterComponent } from './list-footer.component';
import { ButtonModule } from 'primeng/button';
import { UiAsyncAutofocusModule } from '@budgetello/ui/async-autofocus';
import { ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { UiTextInputModule } from '@budgetello/ui/text-input';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [ListFooterComponent],
  exports: [ListFooterComponent],
  imports: [
    CommonModule,
    ButtonModule,
    UiAsyncAutofocusModule,
    ReactiveFormsModule,
    TooltipModule,
    UiTextInputModule,
    AutoCompleteModule,
    HttpClientModule,
  ],
})
export class ListFooterModule {}
