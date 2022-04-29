import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardComponent } from './board.component';
import { RouterTestingModule } from '@angular/router/testing';
import { BoardFacade } from '@budgetello/front-end/board/domain';

const createBoardFacadeMock = () => ({
  destroy: jest.fn(),
  init: jest.fn(),
});

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [BoardComponent],
      providers: [{ provide: BoardFacade, useValue: createBoardFacadeMock() }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
