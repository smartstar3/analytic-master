import { Pipe, PipeTransform } from '@angular/core';
import { Q, QuestionType } from 'src/app/question';
import { Answer } from 'src/app/api/api.service';
import { Counter, Group } from './counter';

@Pipe({
  name: 'serializer',
})
export class SerializerPipe implements PipeTransform {
  transform(data: Answer[], question: Q): Group[] {
    const counter: Counter = new Counter(question);

    for (const answer of data) {
      counter.count(answer.answer);
    }

    if (question.conf.type !== QuestionType.StarRatingQ) {
      counter.setValueZero();
    }

    return counter.groups.map((group) =>
      Object.assign(group, {
        extra: { percent: Math.round(100 * (group.value / counter.total)) },
      })
    );
  }
}
