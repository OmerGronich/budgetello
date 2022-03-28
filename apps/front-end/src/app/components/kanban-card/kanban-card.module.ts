import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KanbanCardComponent } from './kanban-card.component';
import { DynamicDialogModule } from 'primeng/dynamicdialog';

@NgModule({
  declarations: [KanbanCardComponent],
  exports: [KanbanCardComponent],
  imports: [CommonModule, DynamicDialogModule],
})
export class KanbanCardModule {}
