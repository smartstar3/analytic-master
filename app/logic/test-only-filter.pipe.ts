import { QuestionService } from '../form/services/question.service';
import { Pipe, PipeTransform } from '@angular/core';
import { Q, QuestionType } from '../question';

@Pipe({
  name: 'textOnlyFilter',
})
export class TextOnlyFilterPipe implements PipeTransform {
  constructor(private qs: QuestionService) {}
  transform(value: string[]): string[] {
    return value.filter((qid: string) => (this.qs.get[qid] as Q)?.conf.type !== QuestionType.TextQ);
  }
}
