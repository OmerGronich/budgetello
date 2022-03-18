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
  OnChanges,
  Output,
  QueryList,
  SimpleChanges,
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
import { BehaviorSubject, Observable } from 'rxjs';

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

  @ContentChildren(KanbanBoardTemplateDirective) templates: QueryList<any>;

  isCreatingList = false;
  listTitleFormControl = new FormControl('');
  cardTitleFormControl = new FormControl('');
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
    this.cancelAllCardCreations();
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

  createList($event: SubmitEvent) {
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

  stopCreating($event: MouseEvent) {
    $event.stopImmediatePropagation();
    this.cardTitleFormControl.reset();
    this.listTitleFormControl.reset();
    this.isCreatingList = false;
  }

  startCreatingList() {
    this.isCreatingList = true;
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

  createCard({
    list,
    $event,
  }: {
    $event: SubmitEvent | MouseEvent;
    list: IKanbanBoardList;
  }) {
    if ('preventDefault' in $event) {
      $event.preventDefault();
    }
    if ((this.cardTitleFormControl.value || '').trim()) {
      list.cards.push({
        title: this.cardTitleFormControl.value,
      });
      this.cardTitleFormControl.reset();
    }
  }

  clickOutside({ list }: { $event: Event; list: IKanbanBoardList }) {
    list.isCreatingCard = false;
  }

  cancelAllCardCreations() {
    this.lists.forEach((list) => (list.isCreatingCard = false));
  }
}
