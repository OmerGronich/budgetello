import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KanbanCardComponent } from './kanban-card.component';
import { MenuModule } from 'primeng/menu';

@NgModule({
  declarations: [KanbanCardComponent],
  exports: [KanbanCardComponent],
  imports: [CommonModule, MenuModule],
})
export class KanbanCardModule {}
