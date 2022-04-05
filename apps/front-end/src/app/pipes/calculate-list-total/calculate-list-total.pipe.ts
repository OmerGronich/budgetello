import { Pipe, PipeTransform } from '@angular/core';
import { List } from '../../views/board/state/types';

@Pipe({
  name: 'calculateListTotal',
  pure: true,
})
export class CalculateListTotalPipe implements PipeTransform {
  transform(list: List, ...args: unknown[]): number {
    return list.cards.reduce((acc, card) => acc + +card.amount, 0);
  }
}
