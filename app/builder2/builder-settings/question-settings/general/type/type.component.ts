import { Component } from '@angular/core';
import { QuestionService } from '../../../../services/question.service';
import { Q, QuestionType, Settings } from '../../../../../question';
import { TypeChange } from '../../../../services/update/question-update';
import { UpdateType } from '../../../../services/update/update';
import {
  DEFAULT_ADDRESS,
  DEFAULT_EMAIL,
  DEFAULT_GENERIC,
  DEFAULT_MC,
  DEFAULT_NUMBER,
  DEFAULT_OPEN,
  DEFAULT_PC,
  DEFAULT_PHONE,
  DEFAULT_SLIDER,
  DEFAULT_STAR,
  DEFAULT_TEXT,
  DEFAULT_YN,
} from '../../../../../question/q-defaults';
import { SelectionService } from '../../../../services/selection.service';
import { ErrorService } from '../../../../services/error-system/error.service';

@Component({
  selector: 'app-build-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.scss'],
})
export class TypeComponent {
  types: QuestionType[] = [
    QuestionType.OpenQ,
    QuestionType.YesNoQ,
    QuestionType.MultipleChoiceQ,
    QuestionType.StarRatingQ,
    QuestionType.NumberQ,
    QuestionType.SliderChoiceQ,
    QuestionType.EmailQ,
    QuestionType.PhoneNumberQ,
    QuestionType.TextQ,
    QuestionType.AddressQ,
  ];

  constructor(public qs: QuestionService, public sel: SelectionService, public err: ErrorService) {}

  change(to: QuestionType): void {
    changeType(this.qs.get[this.sel.id], to);
    this.err.restrictQ(this.sel.id);
    this.qs.update<TypeChange>({ to, type: UpdateType.TypeChange }, this.sel.id);
  }
}

function changeType(q: Q, to: QuestionType): void {
  const old = q.conf;
  q.conf = getDefaults(to);
  for (const key in q.conf) {
    if (
      Object.prototype.hasOwnProperty.call(q.conf, key) &&
      key !== 'type' &&
      q.conf[key] !== undefined &&
      old[key] !== undefined
    ) {
      // needs to change. maybe an Object.assign?
      q.conf[key] = old[key];
    }
  }
}

export function getDefaults(to: QuestionType): Settings {
  switch (to) {
    case QuestionType.YesNoQ:
      return DEFAULT_YN();
    case QuestionType.PictureChoiceQ:
      return DEFAULT_PC();
    case QuestionType.MultipleChoiceQ:
      return DEFAULT_MC();
    case QuestionType.StarRatingQ:
      return DEFAULT_STAR();
    case QuestionType.SliderChoiceQ:
      return DEFAULT_SLIDER();
    case QuestionType.NumberQ:
      return DEFAULT_NUMBER();
    case QuestionType.PhoneNumberQ:
      return DEFAULT_PHONE();
    case QuestionType.OpenQ:
      return DEFAULT_OPEN();
    case QuestionType.EmailQ:
      return DEFAULT_EMAIL();
    case QuestionType.TextQ:
      return DEFAULT_TEXT();
    case QuestionType.AddressQ:
      return DEFAULT_ADDRESS();
    default:
      return DEFAULT_GENERIC();
  }
}
