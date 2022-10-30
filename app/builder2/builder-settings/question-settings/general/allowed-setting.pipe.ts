import { Pipe, PipeTransform } from '@angular/core';
import { QuestionType } from '../../../../question';

export type Setting =
  | 'type'
  | 'description'
  | 'rating'
  | 'text'
  | 'placeholder'
  | 'minmax'
  | 'star-amount'
  | 'choices'
  | 'pictures';

@Pipe({
  name: 'allowedSetting',
})
export class AllowedSettingPipe implements PipeTransform {
  transform(type: QuestionType, setting: Setting): boolean {
    return getSettings(type).includes(setting);
  }
}

function getSettings(type: QuestionType): Setting[] {
  switch (type) {
    case QuestionType.YesNoQ:
      return ['type', 'description'];
    case QuestionType.PictureChoiceQ:
      return ['type', 'description', 'choices', 'pictures'];
    case QuestionType.MultipleChoiceQ:
      return ['type', 'description', 'choices'];
    case QuestionType.StarRatingQ:
      return ['type', 'description', 'rating', 'star-amount'];
    case QuestionType.SliderChoiceQ:
      return ['type', 'description', 'minmax'];
    case QuestionType.NumberQ:
      return ['type', 'description', 'placeholder', 'minmax'];
    case QuestionType.PhoneNumberQ:
      return ['type', 'description', 'placeholder'];
    case QuestionType.OpenQ:
      return ['type', 'description', 'placeholder'];
    case QuestionType.EmailQ:
      return ['type', 'description', 'placeholder'];
    case QuestionType.TextQ:
      return ['type', 'description', 'text'];
    case QuestionType.AddressQ:
      return ['type', 'description'];
    default:
      return [];
  }
}
