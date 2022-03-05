import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KanbanBoardComponent } from './kanban-board/kanban-board.component';
import {DragDropModule} from "@angular/cdk/drag-drop";

@NgModule({
  imports: [CommonModule, DragDropModule],
  declarations: [
    KanbanBoardComponent
  ],
  exports: [
    KanbanBoardComponent
  ]
})
export class UiKanbanBoardModule {}
