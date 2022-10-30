import { Pipe, PipeTransform } from '@angular/core';
import { ChartType } from '../chart/chart.component';

@Pipe({
  name: 'chartIcon',
})
export class ChartIconPipe implements PipeTransform {
  transform(type: ChartType): string {
    switch (type) {
      case ChartType.VBar:
        return 'equalizer';
      case ChartType.Star:
        return 'notes';
      case ChartType.List:
        return 'list';
      case ChartType.Pie:
        return 'pie_chart';
      case ChartType.Line:
        return 'show_chart';
    }
  }
}
