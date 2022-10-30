import { Pipe, PipeTransform } from '@angular/core';
import { Q, QuestionType } from 'src/app/question';
import { Answer } from 'src/app/api/api.service';
import { QuestionAnswerPair } from './root.component';

@Pipe({
  name: 'noTextOnly',
})
export class NoTextOnlyPipe implements PipeTransform {
  transform(questions: Q[], answers: Answer[][]): QuestionAnswerPair[] {
    const pairs: QuestionAnswerPair[] = [];
    questions.forEach((question, index) => {
      if (question.conf.type !== QuestionType.TextQ) {
        pairs.push({ question, answers: answers[index] });
      }
    });
    return pairs;
  }
}
