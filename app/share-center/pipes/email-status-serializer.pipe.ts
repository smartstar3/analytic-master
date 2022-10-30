import { Pipe, PipeTransform } from '@angular/core';
import { SharedEmailStatistics, SharePercentageStatistic } from '../../resources/interfaces/share-info.interface';

@Pipe({
  name: 'emailStatusSerializer',
})
export class EmailStatusSerializerPipe implements PipeTransform {
  transform(data: SharedEmailStatistics): SharePercentageStatistic[] {
    const result: SharePercentageStatistic[] = [];

    for (const key in data) {
      if (key !== 'totalSize' && Object.prototype.hasOwnProperty.call(data, key)) {
        result.push({
          name: key,
          value: data[key] as number,
          extra: {
            percent: data.totalSize ? Math.round(((data[key] as number) / data.totalSize) * 100) : 0,
          },
        });
      }
    }

    return result;
  }
}
