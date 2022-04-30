import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanCardComponent } from './kanban-card.component';
import { DialogService } from 'primeng/dynamicdialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { AuthFacade, LIST_TYPES } from '@budgetello/front-end-shared-domain';
import { KanbanCardModule } from './kanban-card.module';

class AuthFacadeMock {
  user$ = of({});
}

describe('KanbanCardComponent', () => {
  let component: KanbanCardComponent;
  let fixture: ComponentFixture<KanbanCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KanbanCardModule, HttpClientTestingModule],
      declarations: [KanbanCardComponent],
      providers: [
        DialogService,
        { provide: AuthFacade, useClass: AuthFacadeMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KanbanCardComponent);
    component = fixture.componentInstance;
    component.card = {
      amount: '123',
      id: 'blah',
      title: 'hello',
    };
    component.list = {
      cards: [],
      id: 'bleh',
      title: 'Income',
      type: LIST_TYPES.Income,
      listEnterPredicate(item?: any): boolean {
        return true;
      },
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
