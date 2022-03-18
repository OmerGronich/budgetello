import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './board.component';
import { UiKanbanBoardModule } from '@budgetello/ui/kanban-board';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [BoardComponent],
  imports: [CommonModule, UiKanbanBoardModule, ButtonModule],
})
export class BoardModule {}
