import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BoardsService, IBoard } from '../../services/boards/boards.service';
import { BehaviorSubject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(public boardsService: BoardsService, private router: Router) {}

  get boards$() {
    return this.boardsService.boards$;
  }

  async onCreateBoard($event: SubmitEvent) {
    $event.preventDefault();

    const boardRef = await this.boardsService.addBoard({
      title: this.boardTitleFormControl.value || 'Untitled Board',
    });
    this.boardTitleFormControl.reset();
    this.router.navigate(['/board', boardRef.id]);
  }

  trackByFn(index: number, board: IBoard) {
    return board.id;
  }
}
