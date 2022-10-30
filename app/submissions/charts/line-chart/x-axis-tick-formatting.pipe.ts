import { Pipe, PipeTransform } from '@angular/core';
import { TimeSpan } from '../../chart/multiserialize';

@Pipe({
  name: 'xAxisTickFormatting',
})
export class XAxisTickFormattingPipe implements PipeTransform {
  transform(timespan: TimeSpan): (date: string) => string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return (d: string): string => {
      const date: Date = new Date(d);
      switch (timespan) {
        case 'weeks':
          return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
        case 'months':
          return `${months[date.getMonth()]} ${date.getFullYear()}`;
        case 'years':
          return `${date.getFullYear()}`;
        default:
          return 'what';
      }
    };
  }
}
