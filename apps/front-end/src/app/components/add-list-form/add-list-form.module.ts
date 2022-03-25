import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddListFormComponent } from './add-list-form.component';
import { InputTextModule } from 'primeng/inputtext';
import { UiAsyncAutofocusModule } from '@budgetello/ui/async-autofocus';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { MapListOperatorToIconModule } from '../../pipes/map-list-operator-to-icon/map-list-operator-to-icon.module';
import { ListTypeSelectorModule } from '../list-type-selector/list-type-selector.module';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [AddListFormComponent],
  imports: [
    CommonModule,
    InputTextModule,
    UiAsyncAutofocusModule,
    ReactiveFormsModule,
    DropdownModule,
    MapListOperatorToIconModule,
    ListTypeSelectorModule,
    ButtonModule,
  ],
  exports: [AddListFormComponent],
})
export class AddListFormModule {}
