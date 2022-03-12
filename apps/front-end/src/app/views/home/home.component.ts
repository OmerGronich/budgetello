import { Component } from '@angular/core';
import { IKanbanBoardList } from '@budgetello/ui/kanban-board';

@Component({
  selector: 'budgetello-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  lists: IKanbanBoardList[] = [
    {
      title: 'To Do',
      cards: [{ title: 'Write app' }, { title: 'Write docs' }],
    },
    { title: 'In Progress', cards: [{ title: 'Code app' }] },
    { title: 'Done', cards: [{ title: 'Test app' }] },
  ];
}
