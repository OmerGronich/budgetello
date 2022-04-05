import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Board } from '../board/state/board.model';
import { HomeService } from './state/home.service';
import { HomeQuery } from './state/home.query';

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

  boards$ = this.homeQuery.selectBoards$;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private homeQuery: HomeQuery
  ) {}

  ngOnInit(): void {
    this.homeService.init();
  }

  ngOnDestroy(): void {
    this.boardTitleFormControl.reset();
    this.homeService.destroy();
  }

  setIsCreatingBoard(value: boolean) {
    this._isCreatingBoard$.next(value);
  }

  async onCreateBoard($event: SubmitEvent) {
    $event.preventDefault();

    const boardRef = await this.homeService.addBoard({
      title: this.boardTitleFormControl.value || 'Untitled Board',
    });
    this.boardTitleFormControl.reset();
    this.router.navigate(['/board', boardRef.id]);
  }

  trackByFn(index: number, board: Board) {
    return board.id;
  }
}
