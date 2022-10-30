import { EventEmitter, Injectable, Optional } from '@angular/core';
import { QuestionService as BuilderQuestionService } from '../../builder2/services/question.service';
import { Q } from '../../question';
import { Update } from '../../builder2/services/update/update';
import { PublishedQuestionService } from './published-question.service';

@Injectable()
export class QuestionService {
  constructor(@Optional() public bqs: BuilderQuestionService, @Optional() public pqs: PublishedQuestionService) {
    if (!bqs && !pqs) throw new Error('Neither BuilderQuestionService or PublishedQuestionService are provided.');
  }

  get(id: string | number): Q {
    if (typeof id === 'string') return this.bqs?.get[id] as Q;
    if (typeof id === 'number') return this.pqs?.get[id];
  }

  getChange(id: string | number): EventEmitter<Update> {
    if (typeof id === 'string') return this.bqs?.getChange[id];
    throw new Error(`Unexpected qid type: ${typeof id}. Only builder questions have change emitters`);
  }
}
