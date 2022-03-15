import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { KanbanBoardTemplateDirective } from './kanban-board-template.directive';
import { FormControl } from '@angular/forms';

export interface IKanbanBoardList {
  isCreatingCard: boolean;
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

  @ViewChild('addListInput') input: ElementRef<HTMLInputElement>;
  @ContentChildren(KanbanBoardTemplateDirective) templates: QueryList<any>;

  isCreatingList = false;
  listTitleFormControl = new FormControl('');
  cardTemplate: TemplateRef<any>;
  addListTemplate: TemplateRef<any>;

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

  @HostListener('document:keydown.escape', ['$event']) oneScape(
    event: KeyboardEvent
  ) {
    this.isCreatingList = false;
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
      $event.preventDefault();
      if ((this.listTitleFormControl.value || '').trim()) {
        this.lists.push({
          title: this.listTitleFormControl.value,
          cards: [],
          isCreatingCard: false,
        });

        this.listTitleFormControl.reset();
      }
    }
  }

  stopEditing($event: MouseEvent) {
    $event.stopImmediatePropagation();
    this.listTitleFormControl.reset();
    this.isCreatingList = false;
  }

  startCreatingList() {
    this.isCreatingList = true;
    setTimeout(() => {
      // this will make the execution after the above boolean has changed
      this.input.nativeElement.focus();
    }, 1);
  }

  startCreatingCard({
    $event,
    list,
  }: {
    $event: MouseEvent;
    list: IKanbanBoardList;
  }) {
    $event.stopPropagation();
    this.cancelAllCardCreations();
    list.isCreatingCard = true;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  createCard({ list }: { $event: MouseEvent; list: IKanbanBoardList }) {}

  clickOutside({ list }: { $event: Event; list: IKanbanBoardList }) {
    list.isCreatingCard = false;
  }

  cancelAllCardCreations() {
    this.lists.forEach((list) => (list.isCreatingCard = false));
  }
}
