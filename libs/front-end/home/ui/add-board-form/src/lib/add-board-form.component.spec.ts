import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBoardFormComponent } from './add-board-form.component';
import { AddBoardFormModule } from '@budgetello/front-end/home/ui/add-board-form';
import { By } from '@angular/platform-browser';

describe('AddBoardFormComponent', () => {
  let component: AddBoardFormComponent;
  let fixture: ComponentFixture<AddBoardFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBoardFormModule],
      declarations: [AddBoardFormComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBoardFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render correct text', () => {
    const initialTextSpan = fixture.debugElement.query(
      By.css('[data-test="initial-text"]')
    );
    expect(initialTextSpan.nativeElement.textContent).toEqual(
      'Create a new board'
    );
  });

  it('should render text input if isCreatingBoard is active', () => {
    component.setIsCreatingBoard('active');
    fixture.detectChanges();
    const textInput = fixture.debugElement.query(
      By.css('[data-test="board-name-input"]')
    );
    expect(textInput).not.toBeNull();
  });

  it('should render text input if isCreatingBoard is inactive', () => {
    component.setIsCreatingBoard('inactive');
    fixture.detectChanges();
    const textInput = fixture.debugElement.query(
      By.css('[data-test="board-name-input"]')
    );
    expect(textInput).toBeNull();
  });

  describe('onSubmit', () => {
    it('should emit a new board name', () => {
      jest.spyOn(component.addBoardFormSubmitted, 'emit');
      const title = 'Test Board';
      component.setIsCreatingBoard('active');
      fixture.detectChanges();
      component.boardTitleFormControl.setValue(title);
      fixture.detectChanges();

      const form = fixture.debugElement.query(
        By.css('[data-test="add-board-form"]')
      );
      form.triggerEventHandler('submit', { preventDefault: jest.fn() });
      expect(component.addBoardFormSubmitted.emit).toHaveBeenCalledWith({
        title,
      });
    });
  });
});
