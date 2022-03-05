import {Component, HostBinding, Input} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";

interface KanbanBoardCard {
  title: string;
}

interface KanbanBoardList {
  title: string;
  cards: KanbanBoardCard[];
}

@Component({
  selector: 'budgetello-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss']
})
export class KanbanBoardComponent {

  @Input() cssClasses = '';
  @Input() lists: KanbanBoardList[] = [
    {title: 'To Do', cards: [{title: 'Write app'}, {title: 'Write docs'}]},
    {title: 'In Progress', cards: [{title: 'Code app'}]},
    {title: 'Done', cards: [{title: 'Test app'}]}
  ];

  @HostBinding('class') get classes() {
    return this.cssClasses;
  }

  dropList(event: CdkDragDrop<KanbanBoardList[]>) {
    moveItemInArray(this.lists, event.previousIndex, event.currentIndex);
  }

  drop(event: CdkDragDrop<KanbanBoardCard[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }
}
