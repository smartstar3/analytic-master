import { Pipe, PipeTransform } from '@angular/core';
import { Group } from '../../chart/counter';

@Pipe({
  name: 'starAverage',
})
export class StarAveragePipe implements PipeTransform {
  transform(data: Group[]): number {
    let total = 0;
    let count = 0;
    for (const group of data) {
      total += +group.name * group.value;
      count += group.value;
    }
    return count !== 0 ? total / count : 0;
  }
}
