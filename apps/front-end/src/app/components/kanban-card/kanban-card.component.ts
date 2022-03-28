import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
} from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { KanbanCardDialogComponent } from '../kanban-card-dialog/kanban-card-dialog.component';
import { IList } from '../../services/boards/boards.service';

@Component({
  selector: 'budgetello-kanban-card',
  templateUrl: './kanban-card.component.html',
  styleUrls: ['./kanban-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService],
})
export class KanbanCardComponent implements OnDestroy {
  @Input() card: { title: string; amount: string };
  @Input() list: IList;

  ref: DynamicDialogRef;

  constructor(public dialogService: DialogService) {}

  showCardDialog($event?: MouseEvent) {
    import('../kanban-card-dialog/kanban-card-dialog.module').then((m) => {
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
