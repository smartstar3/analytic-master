import { Injectable, OnDestroy } from '@angular/core';
import { BuilderDescription, UniqueQ } from '../../question';
import { QuestionService } from './question.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { isDescriptionChange, isQuestionAdd, isQuestionDelete } from './update/question-update';
import { Update } from './update/update';

@Injectable()
export class DescriptionService implements OnDestroy {
  private sub: Subscription;
  private subs: { [qid: string]: Subscription } = {};
  descriptions: { [qid: string]: string } = {};

  constructor(private qs: QuestionService) {
    qs.init.pipe(take(1)).subscribe(() => {
      this._init(qs.get);
      this.sub = this.qs.change.subscribe((u: Update) => {
        if (isQuestionAdd(u)) this.add(this.qs.get[u.id]);
        if (isQuestionDelete(u)) this.delete(u.id);
      });
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.clearSubs();
  }

  private updateHandler(qid: string, u: Update): void {
    if (!isDescriptionChange(u)) return;
    this.descriptions[qid] = stringifyDescription(this.qs.get[qid].conf.description as BuilderDescription);
  }

  private clearSubs(): void {
    for (const qid in this.subs) {
      if (!Object.prototype.hasOwnProperty.call(this.subs, qid)) continue;
      this.subs[qid].unsubscribe();
    }
  }

  private _init(questions: { [id: string]: UniqueQ }): void {
    for (const qid in questions) {
      if (!Object.prototype.hasOwnProperty.call(questions, qid)) continue;
      this.add(questions[qid]);
    }
  }

  add(q: UniqueQ): void {
    this.descriptions[q.id] = stringifyDescription(q.conf.description as BuilderDescription);
    this.subs[q.id] = this.qs.getChange[q.id].subscribe((u: Update) => this.updateHandler(q.id, u));
  }

  delete(qid: string): void {
    delete this.descriptions[qid];
    this.subs[qid]?.unsubscribe();
  }
}

function stringifyDescription(description: BuilderDescription): string {
  return description.map((value) => (typeof value !== 'string' ? '___' : value)).join(' ');
}
