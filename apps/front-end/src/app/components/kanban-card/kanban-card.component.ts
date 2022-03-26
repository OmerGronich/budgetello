import { Component, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { getMenuItems } from '../../utils/getMenuItems';

@Component({
  selector: 'budgetello-kanban-card',
  templateUrl: './kanban-card.component.html',
  styleUrls: ['./kanban-card.component.scss'],
})
export class KanbanCardComponent {
  @Input() card: { title: string; amount: string };

  items: MenuItem[] = getMenuItems({
    onEditClick: (event) => {
      console.log('edit clicked');
    },
    onDeleteClick: () => {
      console.log('delete clicked');
    },
  });
}
