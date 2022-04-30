import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanCardDialogComponent } from './kanban-card-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { BoardFacade } from '@budgetello/front-end/board/domain';
import { Card, List, LIST_TYPES } from '@budgetello/front-end-shared-domain';

class BoardFacadeMock {
  updateCard = jest.fn();
  deleteCard = jest.fn();
}

class DynamicDialogConfigMock {
  data: { card: Card; list: List } = {
    card: {
      title: 'ehllo',
      amount: '100',
    },
    list: {
      type: LIST_TYPES.Income,
      cards: [],
      title: 'income',
    },
  };
}

describe('KanbanCardDialogComponent', () => {
  let component: KanbanCardDialogComponent;
  let fixture: ComponentFixture<KanbanCardDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [KanbanCardDialogComponent],
      providers: [
        { provide: DynamicDialogConfig, useClass: DynamicDialogConfigMock },
        { provide: BoardFacade, useClass: BoardFacadeMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KanbanCardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
