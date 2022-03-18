import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BoardsService } from '../../services/boards/boards.service';

@Component({
  selector: 'budgetello-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  constructor(public boardsService: BoardsService) {}

  get boards$() {
    return this.boardsService.boards$;
  }
}
