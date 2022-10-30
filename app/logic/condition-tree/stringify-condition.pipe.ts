import { Optional, Pipe, PipeTransform } from '@angular/core';
import { Comparison, Condition, Op } from '../logic';
import { QuestionType, Settings } from '../../question';
import { QuestionService } from '../../form/services/question.service';
import { PosService } from '../../builder2/services/pos.service';

@Pipe({
  name: 'stringifyCondition',
})
export class StringifyConditionPipe implements PipeTransform {
  constructor(private qs: QuestionService, @Optional() private pos: PosService) {}

  transform(con: Condition): string {
    if (!con) return '';
    if ('and' in con) {
      return '[AND]';
    } else if ('or' in con) {
      return '[OR]';
    } else {
      if (!con.check) return '';
      if (!this.pos) {
        return transformComparison(con.check, this.qs.get(con.check.q).conf, con.check.q as number);
      }
      return transformComparison(con.check, this.qs.get(con.check.q).conf, this.pos.get[con.check.q]);
    }
  }
}

function transformComparison(com: Comparison, conf: Settings, pos: number): string {
  if (isNaN(pos)) {
    return `[DELETED] ${_op(com)} ${_val(com, conf)}`;
  } else {
    return `Q${pos + 1} ${_op(com)} ${_val(com, conf)}`;
  }
}

function _op(com: Comparison): string {
  let op = com.op;
  if (
    (com.val instanceof Array && com.val.length === 1) ||
    (!(com.val instanceof Array) && (op === Op.InclAll || op === Op.InclSome))
  ) {
    op = Op.Eq;
  }
  switch (op) {
    case Op.Eq:
      return com.negate ? '≠' : '=';
    case Op.Gt:
      return com.negate ? '≯' : '>';
    case Op.Gte:
      return com.negate ? '≱' : '≥';
    case Op.Lt:
      return com.negate ? '≮' : '<';
    case Op.Lte:
      return com.negate ? '≰' : '≤';
    case Op.InclAll:
      return com.negate ? `doesn't include all of` : 'includes all of';
    case Op.InclSome:
      return com.negate ? `doesn't include any of` : 'includes any of';
  }
}

function _val(com: Comparison, conf: Settings): string {
  switch (conf.type) {
    case QuestionType.EmailQ:
    case QuestionType.NumberQ:
    case QuestionType.PhoneNumberQ:
    case QuestionType.OpenQ:
    case QuestionType.SliderChoiceQ:
    case QuestionType.StarRatingQ:
      return com.val === null || com.val === undefined || com.val === '' ? '...' : `${com.val}`;
    case QuestionType.YesNoQ:
      return com.val ? 'yes' : 'no';
    case QuestionType.MultipleChoiceQ:
    case QuestionType.PictureChoiceQ:
      if (com.val instanceof Array) {
        return (com.val as number[]).map((i) => conf.choices[i]).join(', ');
      } else {
        return conf.choices[com.val as number];
      }
  }
}
