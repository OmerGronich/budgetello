import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KanbanCardComponent } from './kanban-card.component';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { MapListOperatorToIconModule } from '../../pipes/map-list-operator-to-icon/map-list-operator-to-icon.module';
import { KebabcaseModule } from '../../pipes/kebabcase/kebabcase.module';

@NgModule({
  declarations: [KanbanCardComponent],
  exports: [KanbanCardComponent],
  imports: [
    CommonModule,
    DynamicDialogModule,
    MapListOperatorToIconModule,
    KebabcaseModule,
  ],
})
export class KanbanCardModule {}
