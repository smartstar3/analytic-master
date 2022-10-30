import { PipeTransform, Pipe } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Answers } from 'src/app/question/answer';
import { mergeMap } from 'rxjs/operators';
import { Primitive } from '../../logic/logic';

@Pipe({ name: 'get' })
export class GetPipe implements PipeTransform {
  transform(answers$: Observable<Answers>, q: number): Observable<Primitive> {
    return answers$.pipe(mergeMap((answers) => of(answers.get(q))));
  }
}
