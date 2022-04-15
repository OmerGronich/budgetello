import { Pipe, PipeTransform } from '@angular/core';
import { List } from '../../views/board/state/types';
import { LIST_TYPES } from '../../constants';

@Pipe({
  name: 'calculateListTotal',
  pure: true,
})
export class CalculateListTotalPipe implements PipeTransform {
  transform(list: List, ...args: unknown[]): number {
    const isNotIncomeExpenseList = [
      LIST_TYPES.Summary,
      LIST_TYPES.Stock,
      LIST_TYPES.Split,
    ].includes(list.type);
    if (isNotIncomeExpenseList) {
      return 0;
    }
    return list.cards.reduce((acc, card) => acc + +(card.amount || 0), 0);
  }
}
