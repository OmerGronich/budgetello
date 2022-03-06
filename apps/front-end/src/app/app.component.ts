import { Component } from '@angular/core';
import {IKanbanBoardList} from "@budgetello/ui/kanban-board";

@Component({
  selector: 'budgetello-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  lists: IKanbanBoardList[] = [
    {title: 'To Do', cards: [{title: 'Write app'}, {title: 'Write docs'}]},
    {title: 'In Progress', cards: [{title: 'Code app'}]},
    {title: 'Done', cards: [{title: 'Test app'}]}
  ];

}
