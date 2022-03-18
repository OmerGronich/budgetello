import { Component } from '@angular/core';
import { IKanbanBoardListDto } from '@budgetello/ui/kanban-board';

@Component({
  selector: 'budgetello-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  lists: IKanbanBoardListDto[];
}
