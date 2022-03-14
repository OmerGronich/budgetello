import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
  TemplateRef,
} from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { KanbanBoardTemplateDirective } from './kanban-board-template.directive';
import { FormControl } from '@angular/forms';

export interface IKanbanBoardList {
  title: string;
  cards: any[];
}

@Component({
  selector: 'budgetello-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanBoardComponent implements AfterViewInit {
  @Input() lists: IKanbanBoardList[] = [];
  @Output() addedList = new EventEmitter();

  isEditing = false;
  listTitleFormControl = new FormControl('');
  cardTemplate: TemplateRef<any>;
  addListTemplate: TemplateRef<any>;

  @ContentChildren(KanbanBoardTemplateDirective) templates: QueryList<any>;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.templates.forEach((tmpl) => {
      switch (tmpl.getType()) {
        case 'addListForm':
          this.addListTemplate = tmpl.template;
          break;
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
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  addList($event: SubmitEvent) {
    if (this.addListTemplate) {
      this.addedList.emit($event);
    } else {
      this.lists.push({
        title: this.listTitleFormControl.value,
        cards: [],
      });

      this.listTitleFormControl.reset();
      this.isEditing = false;
    }
  }

  stopEditing($event: MouseEvent) {
    $event.stopImmediatePropagation();
    this.listTitleFormControl.reset();
    this.isEditing = false;
  }
}
