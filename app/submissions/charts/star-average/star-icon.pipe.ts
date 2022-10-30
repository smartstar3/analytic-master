import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'starIcon',
})
export class StarIconPipe implements PipeTransform {
  transform(average: number, total: number): string[] {
    const icons: string[] = [];
    while (average >= 1) {
      icons.push('star');
      average--;
    }

    if (average >= 0.5) {
      icons.push('star_half');
    }

    while (icons.length < total) {
      icons.push('star_border');
    }
    return icons;
  }
}
