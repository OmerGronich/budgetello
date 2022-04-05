import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
} from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { KanbanCardDialogComponent } from '../kanban-card-dialog/kanban-card-dialog.component';
import { LIST_TYPES } from '../../constants';
import { List } from '../../views/board/state/types';

@Component({
  selector: 'budgetello-kanban-card',
  templateUrl: './kanban-card.component.html',
  styleUrls: ['./kanban-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class KanbanCardComponent implements OnDestroy {
  @Input() card: { title: string; amount: string };
  @Input() list: List;

  ref: DynamicDialogRef;

  constructor(public dialogService: DialogService) {}

  showCardDialog(_?: MouseEvent) {
    if (this.list.type === LIST_TYPES.Summary) return;
    import('../kanban-card-dialog/kanban-card-dialog.module').then((_) => {
      this.ref = this.dialogService.open(KanbanCardDialogComponent, {
        showHeader: false,
        width: '370px',
        styleClass: 'kanban-card-dialog',
        contentStyle: {
          'max-height': '500px',
          overflow: 'auto',
          borderRadius: '4px',
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
