import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Input,
  QueryList,
  TemplateRef, ViewEncapsulation
} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {KanbanBoardTemplateDirective} from "./kanban-board-template.directive";


export interface IKanbanBoardList {
  title: string
  cards: any[];
}

@Component({
  selector: 'budgetello-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanBoardComponent implements AfterViewInit {

  @Input() lists: IKanbanBoardList[];

  cardTemplate: TemplateRef<any>;

  @ContentChildren(KanbanBoardTemplateDirective) templates: QueryList<any>;

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngAfterViewInit() {
    this.templates.forEach(tmpl => {
      switch (tmpl.getType()) {
        case 'card':
        default:
          this.cardTemplate = tmpl.template;
          break;
      }
    });

    // todo check why ui was not updating
    this.cdr.detectChanges();
  }

  dropList(event: CdkDragDrop<IKanbanBoardList[]>) {
    moveItemInArray(this.lists, event.previousIndex, event.currentIndex);
  }

  drop(event: CdkDragDrop<any[]>) {
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
