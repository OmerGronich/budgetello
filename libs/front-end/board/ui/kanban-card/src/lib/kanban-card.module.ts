import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KanbanCardComponent } from './kanban-card.component';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { MapListOperatorToIconModule } from '@budgetello/front-end/board/ui/map-list-operator-to-icon';
import { KebabcaseModule } from '@budgetello/front-end/shared/ui/kebabcase';

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
    TagModule,
  ],
})
export class KanbanCardModule {}
