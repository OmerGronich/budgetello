import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapListOperatorToIconPipe } from './map-list-operator-to-icon.pipe';

@NgModule({
  declarations: [MapListOperatorToIconPipe],
  imports: [CommonModule],
  exports: [MapListOperatorToIconPipe],
})
export class MapListOperatorToIconModule {}
