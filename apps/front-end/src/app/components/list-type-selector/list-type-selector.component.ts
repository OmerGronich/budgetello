import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LIST_TYPES } from '../../constants';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'budgetello-list-type-selector',
  templateUrl: './list-type-selector.component.html',
  styleUrls: ['./list-type-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListTypeSelectorComponent {
  @Input() control: FormControl;

  listTypeOptions = [
    {
      value: LIST_TYPES.Income,
      label: 'Income',
    },
    {
      value: LIST_TYPES.Expense,
      label: 'Expense',
    },
    {
      value: LIST_TYPES.Split,
      label: 'Split',
      disabled: true,
    },
    {
      value: LIST_TYPES.Stock,
      label: 'Stock',
    },
  ];
}
