import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListHeaderComponent } from './list-header.component';
import { ConfirmationService } from 'primeng/api';
import { ListHeaderModule } from '@budgetello/front-end/board/ui/list-header';
import { LIST_TYPES } from '@budgetello/front-end-shared-domain';

describe('ListHeaderComponent', () => {
  let component: ListHeaderComponent;
  let fixture: ComponentFixture<ListHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListHeaderModule],
      declarations: [ListHeaderComponent],
      providers: [ConfirmationService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListHeaderComponent);
    component = fixture.componentInstance;
    component.list = {
      cards: [],
      disableDrag: false,
      id: 'blah',
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
