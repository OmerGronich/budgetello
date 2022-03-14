import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KanbanBoardComponent } from './kanban-board/kanban-board.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { KanbanBoardTemplateDirective } from './kanban-board/kanban-board-template.directive';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    DragDropModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
  ],
  declarations: [KanbanBoardComponent, KanbanBoardTemplateDirective],
  exports: [KanbanBoardComponent, KanbanBoardTemplateDirective],
})
export class UiKanbanBoardModule {}
