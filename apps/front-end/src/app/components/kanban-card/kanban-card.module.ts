import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KanbanCardComponent } from './kanban-card.component';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { MapListOperatorToIconModule } from '../../pipes/map-list-operator-to-icon/map-list-operator-to-icon.module';
import { KebabcaseModule } from '../../pipes/kebabcase/kebabcase.module';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [KanbanCardComponent],
  exports: [KanbanCardComponent],
  imports: [
    CommonModule,
    DynamicDialogModule,
    MapListOperatorToIconModule,
    KebabcaseModule,
    PanelModule,
    ButtonModule,
    DividerModule,
    TooltipModule,
  ],
})
export class KanbanCardModule {}
