import { Pipe, PipeTransform } from '@angular/core';
import { QuestionType } from '../../../../../question';

@Pipe({
  name: 'typeString',
})
export class TypeStringPipe implements PipeTransform {
  transform(value: QuestionType): string {
    switch (value) {
      case QuestionType.YesNoQ:
        return 'Yes/No Question';
      case QuestionType.PictureChoiceQ:
        return 'Picture Choice Question';
      case QuestionType.MultipleChoiceQ:
        return 'Multiple Choice Question';
      case QuestionType.StarRatingQ:
        return 'Star Rating Question';
      case QuestionType.SliderChoiceQ:
        return 'Number Slider Question';
      case QuestionType.NumberQ:
        return 'Number Question';
      case QuestionType.PhoneNumberQ:
        return 'Phone Number Question';
      case QuestionType.OpenQ:
        return 'Open Question';
      case QuestionType.EmailQ:
        return 'Email Question';
      case QuestionType.TextQ:
        return 'Comment';
      case QuestionType.AddressQ:
        return 'Address Question (Dutch)';
      default:
        return 'Unknown Question';
    }
  }
}
