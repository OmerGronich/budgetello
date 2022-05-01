import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
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
  boards$ = this.homeFacade.boards$;

  constructor(private router: Router, private homeFacade: HomeFacade) {}

  ngOnInit(): void {
    this.homeFacade.init();
  }

  ngOnDestroy(): void {
    this.homeFacade.destroy();
  }

  async onCreateBoard({
    title = 'Untitled Board',
  }: {
    title: string;
  }): Promise<boolean> {
    try {
      const boardRef = await this.homeFacade.addBoard({
        title,
      });
      return this.router.navigate(['/board', boardRef.id]);
    } catch (e) {
      return false;
    }
  }

  trackByFn(index: number, board: Board) {
    return board.id;
  }
}
