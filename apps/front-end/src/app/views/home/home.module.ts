import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { UiKanbanBoardModule } from '@budgetello/ui/kanban-board';
import { BoardPreviewModule } from '../../components/board-preview/board-preview.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, UiKanbanBoardModule, BoardPreviewModule],
})
export class HomeModule {}
