import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'undefined' })
export class UndefinedPipe implements PipeTransform {
  transform(str: string | number): string {
    if (str) {
      return `${str}`;
    }
    return '';
  }
}
