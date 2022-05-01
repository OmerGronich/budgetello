import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardPreviewComponent } from './board-preview.component';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { BOARD_TITLE } from './tests/mocks';
import { By } from '@angular/platform-browser';

describe('BoardPreviewComponent', () => {
  @Component({
    template:
      '<budgetello-board-preview [boardTitle]="boardTitle"></budgetello-board-preview>',
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  class TestHostComponent {
    @Input() boardTitle: string;
  }

  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestHostComponent, BoardPreviewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    component.boardTitle = BOARD_TITLE;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the board title', () => {
    const boardTitle = fixture.debugElement.query(
      By.css('[data-test="board-title"]')
    );
    expect(boardTitle.nativeElement.textContent).toBe(BOARD_TITLE);
  });
});
