import { Injectable, OnDestroy } from '@angular/core';
import { QuestionService } from './question.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { isQuestionAdd, isQuestionDelete, isTypeChange } from './update/question-update';
import { Update } from './update/update';
import { UniqueQ } from '../../question';
import { ErrorService } from './error-system/error.service';
import { Comparison, Condition } from '../../logic/logic';
import { If, Jump } from '../../logic/jump';
import { defaultOp } from '../../logic/condition-tree/comparison/comparison.component';

@Injectable()
export class LogicValidationService implements OnDestroy {
  private subs: { [qid: string]: Subscription } = {};
  private sub: Subscription;

  constructor(private qs: QuestionService, private err: ErrorService) {
    qs.init.pipe(take(1)).subscribe(() => {
      this._init(qs.order.value);
      this.sub = this.qs.change.subscribe((u: Update) => {
        if (isQuestionAdd(u)) this.add(this.qs.get[u.id]);
        if (isQuestionDelete(u)) this.delete(u.id);
      });
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.clearSubs();
  }

  private clearSubs(): void {
    for (const qid in this.subs) {
      if (!Object.prototype.hasOwnProperty.call(this.subs, qid)) continue;
      this.subs[qid].unsubscribe();
    }
  }

  add(q: UniqueQ): void {
    this.subs[q.id] = this.qs.getChange[q.id].subscribe((u: Update) => {
      if (isTypeChange(u)) {
        this.jumpIterator(this.typeChange(q.id));
      }
    });
  }

  delete(qid: string): void {
    this.subs[qid]?.unsubscribe();
    this.jumpIterator(this.deleted(qid), this.deletedThen(qid));
  }

  jumpIterator(
    con: (c: Comparison, path?: string) => Comparison,
    then: (then: Jump, path?: string) => Jump = (t: Jump) => t
  ): void {
    for (const qid of this.qs.order.value) {
      const q = this.qs.get[qid];
      if (!q.conf.jumps) continue;
      q.conf.jumps.forEach((jump: If, i: number) => {
        this.conditionIterator(`questions.${qid}.jumps.${i}`, jump.condition, con);
        then(jump.then);
      });
    }
  }

  conditionIterator(path: string, condition: Condition, func: (c: Comparison, path?: string) => Comparison): void {
    if ('and' in condition) {
      condition.and.forEach((con: Condition, i: number) => this.conditionIterator(path + `.and.${i}`, con, func));
    } else if ('or' in condition) {
      condition.or.forEach((con: Condition, i: number) => this.conditionIterator(path + `.or.${i}`, con, func));
    } else {
      condition.check = func(condition.check, path + `.check`);
    }
  }

  private _init(ids: string[]): void {
    for (const qid of ids) {
      this.add(this.qs.get[qid]);
    }
  }

  private typeChange(qid: string): (c: Comparison, path: string) => Comparison {
    return (c: Comparison, path: string) => {
      if ((c.q as string) === qid) {
        c.op = defaultOp(this.qs.get[qid].conf.type);
        c.val = null;
        const node = this.err.get(path);
        node.value = { error: 'Invalid logic jump' };
        node.show = true;
      }
      return c;
    };
  }

  private deleted(qid: string): (c: Comparison, path: string) => Comparison {
    return (c: Comparison, path: string) => {
      if ((c.q as string) === qid) {
        const node = this.err.get(path);
        node.value = { error: 'Invalid condition' };
        node.show = true;
      }
      return c;
    };
  }

  private deletedThen(qid: string): (then: Jump, path: string) => Jump {
    return (then: Jump, path: string) => {
      if ((then as string) === qid) {
        const node = this.err.get(path);
        node.value = { error: 'Invalid condition' };
        node.show = true;
      }
      return then;
    };
  }
}
