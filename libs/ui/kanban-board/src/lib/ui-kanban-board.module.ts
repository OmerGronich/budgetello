import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {KanbanBoardComponent} from './kanban-board/kanban-board.component';
import {DragDropModule} from "@angular/cdk/drag-drop";
import {KanbanBoardTemplateDirective} from './kanban-board/kanban-board-template.directive';

@NgModule({
  imports: [CommonModule, DragDropModule],
  declarations: [
    KanbanBoardComponent,
    KanbanBoardTemplateDirective
  ],
  exports: [
    KanbanBoardComponent,
    KanbanBoardTemplateDirective,
  ]
})
export class UiKanbanBoardModule {}
