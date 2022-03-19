import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  BoardsService,
  IBoard,
  IBoardDto,
} from '../../services/boards/boards.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFirestoreDocument } from '@angular/fire/compat/firestore';

@Component({
  selector: 'budgetello-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardComponent {
  private boardDoc: AngularFirestoreDocument<IBoardDto>;
  board$: Observable<IBoard>;

  constructor(
    private boardsService: BoardsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    ({ board$: this.board$, boardDoc: this.boardDoc } =
      this.boardsService.getBoard(this.boardId));
  }

  get boardId() {
    return this.route.snapshot.paramMap.get('id') || '';
  }

  updateBoardTitle($event: { title: string }) {
    this.boardDoc.update($event);
  }

  deleteBoard() {
    this.boardDoc.delete();
    this.router.navigate(['/']);
  }
}
