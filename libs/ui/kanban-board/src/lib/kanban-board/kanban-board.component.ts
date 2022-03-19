import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import {
  CdkDragDrop,
  CdkDragStart,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { KanbanBoardTemplateDirective } from './kanban-board-template.directive';
import { FormControl } from '@angular/forms';

interface IKanbanBoardListDto {
  title: string;
  cards: any[];
}

interface IKanbanBoardList {
  title: string;
  cards: any[];
  isCreatingCard: boolean;
}

@Component({
  selector: 'budgetello-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanBoardComponent implements AfterViewInit, OnChanges {
  listsFromDto: IKanbanBoardList[] = [];
  @Input() lists: IKanbanBoardListDto[] = [];
  @Input() isCreatingList = false;
  @Output() listAdded = new EventEmitter();
  @Output() addListFormHide = new EventEmitter();
  @Input() listCssClassMapper = '';

  @ContentChildren(KanbanBoardTemplateDirective) templates: QueryList<any>;

  listTitleFormControl = new FormControl('');
  cardTitleFormControl = new FormControl('');
  cardTemplate: TemplateRef<any>;
  addListTemplate: TemplateRef<any>;
  listHeaderTemplate: TemplateRef<any>;
  height: number;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lists']) {
      this.listsFromDto = this.createListsFromDto(
        changes['lists'].currentValue
      );
    }
  }

  createListsFromDto(listsDto: IKanbanBoardListDto[]): IKanbanBoardList[] {
    return listsDto.map((listDto) => ({
      ...listDto,
      isCreatingCard: false,
    }));
  }

  ngAfterViewInit() {
    this.templates.forEach((tmpl) => {
      switch (tmpl.getType()) {
        case 'listHeader':
          this.listHeaderTemplate = tmpl.template;
          break;
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
    this.addListFormHide.emit();
  }

  dropList(event: CdkDragDrop<IKanbanBoardListDto[]>) {
    moveItemInArray(this.listsFromDto, event.previousIndex, event.currentIndex);
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
      this.listAdded.emit($event);
    } else {
      $event.preventDefault();
      if ((this.listTitleFormControl.value || '').trim()) {
        this.listsFromDto.push({
          title: this.listTitleFormControl.value,
          cards: [],
          isCreatingCard: false,
        });

        this.listTitleFormControl.reset();
      }
    }
  }

  stopCreatingList($event: MouseEvent) {
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
    list: IKanbanBoardListDto;
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
    this.listsFromDto.forEach((list) => (list.isCreatingCard = false));
  }

  cdkListDragStarted($event: CdkDragStart) {
    const root = document.documentElement;
    root.style.setProperty(
      '--kanban-list-placeholder-height',
      $event.source.element.nativeElement.offsetHeight + 'px'
    );
  }

  cdkCardDragStarted($event: CdkDragStart) {
    const root = document.documentElement;
    const element = document.querySelector('.cdk-drag-preview');
    root.style.setProperty(
      '--kanban-card-placeholder-height',
      element?.clientHeight + 'px'
    );
  }

  handleClickOutside($event: Event) {
    this.isCreatingList = false;
  }
}
