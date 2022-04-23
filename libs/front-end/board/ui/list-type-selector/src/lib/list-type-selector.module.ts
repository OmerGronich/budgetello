import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListTypeSelectorComponent } from './list-type-selector.component';
import { DropdownModule } from 'primeng/dropdown';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MapListOperatorToIconModule } from '@budgetello/front-end/board/ui/map-list-operator-to-icon';

@NgModule({
  declarations: [ListTypeSelectorComponent],
  imports: [
    CommonModule,
    DropdownModule,
    ReactiveFormsModule,
    MapListOperatorToIconModule,
    ButtonModule,
  ],
  exports: [ListTypeSelectorComponent],
})
export class ListTypeSelectorModule {}
