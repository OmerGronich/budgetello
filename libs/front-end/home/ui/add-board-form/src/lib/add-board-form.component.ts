import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'budgetello-add-board-form',
  templateUrl: './add-board-form.component.html',
  styleUrls: ['./add-board-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddBoardFormComponent implements OnDestroy {
  @Output() addBoardFormSubmitted = new EventEmitter<{ title: string }>();
  boardTitleFormControl = new FormControl('');
  private _isCreatingBoard$ = new BehaviorSubject(false);

  get isCreatingBoard$() {
    return this._isCreatingBoard$.asObservable();
  }

  setIsCreatingBoard(value: boolean) {
    this._isCreatingBoard$.next(value);
  }

  ngOnDestroy(): void {
    this.boardTitleFormControl.reset();
  }

  onSubmit($event: SubmitEvent) {
    $event.preventDefault();
    this.addBoardFormSubmitted.emit({
      title: this.boardTitleFormControl.value,
    });
  }
}
