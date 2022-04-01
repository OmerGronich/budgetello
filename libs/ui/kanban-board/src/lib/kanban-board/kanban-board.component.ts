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
  cssClass: string;
  title: string;
  cards: any[];
  isCreatingCard: boolean;
  id?: string;
  disableDrag?: boolean;
  doNotEnter?: boolean;
  lockAxis?: 'y' | 'x';
}

@Component({
  selector: 'budgetello-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KanbanBoardComponent implements AfterViewInit, OnChanges {
  kanbanBoardLists: IKanbanBoardList[] = [];
  @Input() getListCssClass: (list: any) => string;
  @Input() lists: any[] | null = [];
  @Input() isCreatingList = false;
  @Output() listAdded = new EventEmitter();
  @Output() addListFormHide = new EventEmitter();
  @Output() listCreationFormClosed = new EventEmitter();
  @Output() listReordered = new EventEmitter();
  @Output() cardsReordered = new EventEmitter();
  @Input() listCssClassMapper = '';

  @ContentChildren(KanbanBoardTemplateDirective) templates: QueryList<any>;

  listTitleFormControl = new FormControl('');
  cardTitleFormControl = new FormControl('');
  cardTemplate: TemplateRef<any>;
  addListTemplate: TemplateRef<any>;
  listHeaderTemplate: TemplateRef<any>;
  listFooterTemplate: TemplateRef<any>;
  height: number;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lists']) {
      this.kanbanBoardLists = this.createListsFromDto(
        changes['lists'].currentValue
      );
    }
  }

  createListsFromDto(listsDto: IKanbanBoardListDto[]): IKanbanBoardList[] {
    return (listsDto || []).map((listDto) => ({
      ...listDto,
      isCreatingCard: false,
      cssClass: this.getListCssClass(listDto),
    }));
  }

  ngAfterViewInit() {
    this.templates.forEach((tmpl) => {
      switch (tmpl.getType()) {
        case 'listFooter':
          this.listFooterTemplate = tmpl.template;
          break;
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
    moveItemInArray(
      this.kanbanBoardLists,
      event.previousIndex,
      event.currentIndex
    );
    this.listReordered.emit(this.kanbanBoardLists);
  }

  dropCard(event: CdkDragDrop<any[]>) {
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

    this.cardsReordered.emit(this.kanbanBoardLists);
  }

  createList($event: SubmitEvent) {
    if (this.addListTemplate) {
      this.listAdded.emit($event);
    } else {
      $event.preventDefault();
      if ((this.listTitleFormControl.value || '').trim()) {
        this.kanbanBoardLists.push({
          title: this.listTitleFormControl.value,
          cards: [],
          isCreatingCard: false,
          cssClass: '',
        });

        this.listTitleFormControl.reset();
      }
    }
  }

  stopCreatingList($event: Event) {
    $event?.stopImmediatePropagation();
    this.cardTitleFormControl.reset();
    this.listTitleFormControl.reset();
    this.isCreatingList = false;
    this.listCreationFormClosed.emit();
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
    this.kanbanBoardLists.forEach((list) => (list.isCreatingCard = false));
    this.cardTitleFormControl.reset();
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

  stopCreatingCard($event: { $event: MouseEvent; list: IKanbanBoardList }) {
    $event.list.isCreatingCard = false;
    this.cardTitleFormControl.reset();
  }

  listTrackBy(index: number, list: IKanbanBoardList) {
    return list.id;
  }

  listEnterPredicate(list: IKanbanBoardList) {
    return !list.doNotEnter;
  }
}
