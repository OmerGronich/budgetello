import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddListFormComponent } from './add-list-form.component';
import { InputTextModule } from 'primeng/inputtext';
import { AsyncAutofocusModule } from '@budgetello/front-end-shared-ui-async-autofocus';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { MapListOperatorToIconModule } from '@budgetello/front-end/board/ui/map-list-operator-to-icon';
import { ListTypeSelectorModule } from '@budgetello/front-end/board/ui/list-type-selector';

@NgModule({
  declarations: [AddListFormComponent],
  imports: [
    CommonModule,
    InputTextModule,
    AsyncAutofocusModule,
    ReactiveFormsModule,
    DropdownModule,
    MapListOperatorToIconModule,
    ListTypeSelectorModule,
    ButtonModule,
  ],
  exports: [AddListFormComponent],
})
export class AddListFormModule {}
