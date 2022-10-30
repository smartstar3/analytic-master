import { Component, Input, Output, EventEmitter, Pipe, PipeTransform, OnChanges, SimpleChanges } from '@angular/core';
import { Q, QuestionType, Description } from 'src/app/question';
import { BasicEnv, Env, Primitive } from '../../logic/logic';
import { QuestionService } from '../services/question.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent<T extends Primitive> implements OnChanges {
  readonly qType = QuestionType;
  @Input() qid: string | number;
  @Input() answer: T;
  @Input() disabled = false;
  @Output() answered: EventEmitter<T> = new EventEmitter<T>();
  @Output() changed: EventEmitter<{
    value: T;
    valid: boolean;
  }> = new EventEmitter<{
    value: T;
    valid: boolean;
  }>();

  private _question: Q;
  get question(): Q {
    return this._question;
  }
  set question(question: Q) {
    this._question = question;
  }

  constructor(protected qs: QuestionService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!Object.prototype.hasOwnProperty.call(changes, 'qid')) return;
    this._question = this.qs.get(this.qid);
  }
}

@Pipe({
  name: 'stringifyDescription',
})
export class StringifyDescriptionPipe implements PipeTransform {
  transform(description: Description, env: Env<number> = new BasicEnv()): string {
    return description
      .map((value) => {
        if (typeof value === 'number') {
          return (env && env.get(value) !== undefined && `${env.getString(value)}`) || '___';
        } else {
          return value;
        }
      })
      .join(' ');
  }
}
