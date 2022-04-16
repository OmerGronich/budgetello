import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { KanbanCardDialogComponent } from '../kanban-card-dialog/kanban-card-dialog.component';
import { LIST_TYPES } from '../../constants';
import { Card, List } from '../../views/board/state/types';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  firstValueFrom,
  map,
  Observable,
  shareReplay,
  tap,
} from 'rxjs';
import { AuthenticationService } from '../../services/authentication/authentication.service';

export interface GlobalQuote {
  '01. symbol': string;
  '02. open': string;
  '03. high': string;
  '04. low': string;
  '05. price': string;
  '06. volume': string;
  '07. latest trading day': string;
  '08. previous close': string;
  '09. change': string;
  '10. change percent': string;
}

export interface ApiResponse {
  'Global Quote': GlobalQuote;
}

@Component({
  selector: 'budgetello-kanban-card',
  templateUrl: './kanban-card.component.html',
  styleUrls: ['./kanban-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class KanbanCardComponent implements OnInit, OnDestroy {
  @Input() card: Card;
  @Input() list: List;

  ref: DynamicDialogRef;
  listTypes = LIST_TYPES;

  stockData$: Observable<{ stockPrice: string; total: number }>;
  apiLimit$ = new BehaviorSubject(false);

  constructor(
    public dialogService: DialogService,
    private http: HttpClient,
    private auth: AuthenticationService
  ) {}

  async ngOnInit() {
    if (this.list.type === this.listTypes.Stock && this.card.stockSymbol) {
      const user = await firstValueFrom(this.auth.user$);
      const idToken = await user?.getIdToken(true);

      this.stockData$ = this.http
        .get<ApiResponse>('/api/search-stock', {
          params: { symbol: this.card.stockSymbol },
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        })
        .pipe(
          shareReplay(1),
          tap(({ Note }: any) => {
            if (Note) {
              this.apiLimit$.next(true);
            }
          }),
          map((response: ApiResponse) => {
            if (!response['Global Quote']) {
              return { stockPrice: '', total: 0 };
            }
            const stockPrice = response['Global Quote']['05. price'];
            const total = (this.card.shares as number) * +stockPrice;

            return { stockPrice, total };
          })
        );
    }
  }

  showCardDialog(ev?: MouseEvent) {
    ev?.preventDefault();
    if (this.list.type === LIST_TYPES.Summary) return;
    import('../kanban-card-dialog/kanban-card-dialog.module').then((_) => {
      this.ref = this.dialogService.open(KanbanCardDialogComponent, {
        closable: true,
        showHeader: true,
        header: 'Edit / delete card',
        width: '370px',
        styleClass: 'kanban-card-dialog',
        contentStyle: {
          'max-height': '500px',
          paddingTop: '1rem',
          overflow: 'auto',
        },
        autoZIndex: true,
        dismissableMask: true,
        data: {
          card: this.card,
          list: this.list,
        },
      });
    });
  }

  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close();
    }
  }
}
