import { Pipe, PipeTransform } from '@angular/core';
import { QuestionService } from '../services/question.service';
import { QuestionType } from '../../question';

@Pipe({
  name: 'editable',
})
export class EditableQuestionPipe implements PipeTransform {
  constructor(private qs: QuestionService) {}
  transform(qid: string): boolean {
    switch (this.qs.get[qid].conf.type) {
      case QuestionType.MultipleChoiceQ:
      case QuestionType.PictureChoiceQ:
        return this.qs.get[qid].conf.allowMultiple;
      case QuestionType.StarRatingQ:
      case QuestionType.YesNoQ:
        return false;
      default:
        return true;
    }
  }
}
