import { Pipe, PipeTransform } from '@angular/core';
import kebabCase from 'lodash.kebabcase';

@Pipe({
  name: 'kebabcase',
})
export class KebabcasePipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): unknown {
    return kebabCase(value);
  }
}
