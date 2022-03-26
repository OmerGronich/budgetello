import { Pipe, PipeTransform } from '@angular/core';
import { IList } from '../../services/boards/boards.service';

@Pipe({
  name: 'calculateListTotal',
  pure: true,
})
export class CalculateListTotalPipe implements PipeTransform {
  transform(list: IList, ...args: unknown[]): number {
    return list.cards.reduce((acc, card) => acc + +card.amount, 0);
  }
}
