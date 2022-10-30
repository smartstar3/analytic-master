import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tooltipColor',
})
export class TooltipColorPipe implements PipeTransform {
  transform(state: string): { color: string } {
    if (state === 'published') return { color: 'primary' };
    return { color: 'gray' };
  }
}
