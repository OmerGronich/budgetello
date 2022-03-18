import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './board.component';
import { UiKanbanBoardModule } from '@budgetello/ui/kanban-board';

@NgModule({
  declarations: [BoardComponent],
  imports: [CommonModule, UiKanbanBoardModule],
})
export class BoardModule {}
