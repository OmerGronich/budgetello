import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { getMenuItems } from '../../utils/getMenuItems';

@Component({
  selector: 'budgetello-list-context-menu',
  templateUrl: './list-context-menu.component.html',
  styleUrls: ['./list-context-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListContextMenuComponent {
  @Output() editButtonClicked = new EventEmitter();
  @Output() deleteButtonClicked = new EventEmitter();

  items: MenuItem[] = getMenuItems({
    onEditClick: (event) => {
      event.originalEvent.stopImmediatePropagation();
      this.editButtonClicked.emit();
    },
    onDeleteClick: () => {
      this.deleteButtonClicked.emit();
    },
  });
}
