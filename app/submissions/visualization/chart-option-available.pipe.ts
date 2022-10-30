import { Pipe, PipeTransform } from '@angular/core';
import { QuestionType } from '../../question';
import { ChartType } from '../chart/chart.component';

@Pipe({
  name: 'chartOptionAvailable',
})
export class ChartOptionAvailablePipe implements PipeTransform {
  transform(questionType: QuestionType, chartType: ChartType): boolean {
    switch (questionType) {
      case QuestionType.MultipleChoiceQ:
      case QuestionType.PictureChoiceQ:
      case QuestionType.YesNoQ:
        return chartType === ChartType.Pie || chartType === ChartType.VBar || chartType === ChartType.Line;
      case QuestionType.StarRatingQ:
        return chartType === ChartType.Star || chartType === ChartType.Line;
      case QuestionType.SliderChoiceQ:
      case QuestionType.NumberQ:
        return chartType === ChartType.List;
      default:
        return chartType === ChartType.List;
    }
  }
}
