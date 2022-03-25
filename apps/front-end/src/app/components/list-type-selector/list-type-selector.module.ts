import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListTypeSelectorComponent } from './list-type-selector.component';
import { DropdownModule } from 'primeng/dropdown';
import { ReactiveFormsModule } from '@angular/forms';
import { MapListOperatorToIconModule } from '../../pipes/map-list-operator-to-icon/map-list-operator-to-icon.module';
import { ButtonModule } from 'primeng/button';

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
