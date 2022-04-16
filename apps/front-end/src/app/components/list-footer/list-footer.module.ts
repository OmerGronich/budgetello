import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListFooterComponent } from './list-footer.component';
import { ButtonModule } from 'primeng/button';
import { FrontEndSharedUiAsyncAutofocusModule } from '@budgetello/front-end-shared-ui-async-autofocus';
import { ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { FrontEndSharedUiTextInputModule } from '@budgetello/front-end-shared-ui-text-input';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
  declarations: [ListFooterComponent],
  exports: [ListFooterComponent],
  imports: [
    CommonModule,
    ButtonModule,
    FrontEndSharedUiAsyncAutofocusModule,
    ReactiveFormsModule,
    TooltipModule,
    FrontEndSharedUiTextInputModule,
    AutoCompleteModule,
    InputNumberModule,
    InputTextModule,
  ],
})
export class ListFooterModule {}
