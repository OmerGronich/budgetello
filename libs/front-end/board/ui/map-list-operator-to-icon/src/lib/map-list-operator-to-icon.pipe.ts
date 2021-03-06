import { Pipe, PipeTransform } from '@angular/core';
import { LIST_OPERATORS } from '@budgetello/front-end-shared-domain';

@Pipe({
  name: 'mapListOperatorToIcon',
  pure: true,
})
export class MapListOperatorToIconPipe implements PipeTransform {
  transform(value: LIST_OPERATORS, ...args: any[]): string {
    if (args.includes('color')) {
      return {
        '+': 'secondary',
        '-': 'danger',
        '%': 'info',
        '=': 'primary',
        $: 'success',
      }[value];
    }

    const dict: Record<LIST_OPERATORS, string> = {
      '+': 'plus-circle',
      '-': 'minus-circle',
      '%': 'sync',
      '=': 'book',
      $: 'money-bill',
    };

    return dict[value] || '';
  }
}
