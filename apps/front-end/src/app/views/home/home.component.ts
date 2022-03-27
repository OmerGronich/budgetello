import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BoardsService } from '../../services/boards/boards.service';
import { BehaviorSubject } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'budgetello-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  boardTitleFormControl = new FormControl('');
  private _isCreatingBoard$ = new BehaviorSubject(false);

  get isCreatingBoard$() {
    return this._isCreatingBoard$.asObservable();
  }

  setIsCreatingBoard(value: boolean) {
    this._isCreatingBoard$.next(value);
  }

  constructor(public boardsService: BoardsService) {}

  get boards$() {
    return this.boardsService.boards$;
  }

  onCreateBoard($event: SubmitEvent) {
    $event.preventDefault();

    this.boardsService.addBoard({
      title: this.boardTitleFormControl.value || 'Untitled Board',
    });
  }
}
