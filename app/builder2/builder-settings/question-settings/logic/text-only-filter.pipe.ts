import { Pipe, PipeTransform } from '@angular/core';
import { QuestionType } from '../../../../question';
import { QuestionService } from '../../../services/question.service';

@Pipe({
  name: 'textOnlyFilter',
})
export class TextOnlyFilterPipe implements PipeTransform {
  constructor(private qs: QuestionService) {}
  transform(value: string[]): string[] {
    return value.filter((qid: string) => this.qs.get[qid].conf.type !== QuestionType.TextQ);
  }
}
