import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { HomeFacade } from '@budgetello/front-end/home/domain';
import { Board } from '@budgetello/front-end-shared-domain';

@Component({
  selector: 'budgetello-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, OnDestroy {
  boardTitleFormControl = new FormControl('');
  private _isCreatingBoard$ = new BehaviorSubject(false);

  get isCreatingBoard$() {
    return this._isCreatingBoard$.asObservable();
  }

  boards$ = this.homeFacade.boards$;

  constructor(private router: Router, private homeFacade: HomeFacade) {}

  ngOnInit(): void {
    this.homeFacade.init();
  }

  ngOnDestroy(): void {
    this.boardTitleFormControl.reset();
    this.homeFacade.destroy();
  }

  setIsCreatingBoard(value: boolean) {
    this._isCreatingBoard$.next(value);
  }

  async onCreateBoard($event: SubmitEvent) {
    $event.preventDefault();

    const boardRef = await this.homeFacade.addBoard({
      title: this.boardTitleFormControl.value || 'Untitled Board',
    });
    this.router.navigate(['/board', boardRef.id]);
    this.boardTitleFormControl.reset();
  }

  trackByFn(index: number, board: Board) {
    return board.id;
  }
}
