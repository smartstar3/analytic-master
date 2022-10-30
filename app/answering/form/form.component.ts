import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Design, Q, QuestionType } from 'src/app/question';
import { Answers, DBAnswers } from 'src/app/question/answer';
import { Font } from 'ngx-font-picker';
import { Primitive } from '../../logic/logic';
import { PublishedQuestionService } from '../../form/services/published-question.service';
import { PublishedEndService } from '../../form/services/published-end.service';
import { PublishedStartService } from '../../form/services/published-start.service';
import { DEFAULT_DESIGN } from '../../builder2/services/save.service';
import { InitService } from '../../form/services/init.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  answers: Answers;
  path: number[] = [];
  state: 'starting' | 'started' | 'ended';
  @Output() readonly submitted: EventEmitter<DBAnswers> = new EventEmitter<DBAnswers>();
  updater: EventEmitter<Answers> = new EventEmitter<Answers>();
  design: Design = DEFAULT_DESIGN;
  endScreen: number | string;
  @ViewChild('id') el: ElementRef;
  n = 1;
  questionTypes = QuestionType;
  progress = 0;

  public font: Font = new Font({
    family: '',
    size: '14px',
    style: 'regular',
    styles: ['regular'],
  });

  constructor(
    public qs: PublishedQuestionService,
    public es: PublishedEndService,
    public ss: PublishedStartService,
    public is: InitService
  ) {}

  ngOnInit(): void {
    this.is.init.pipe(take(1)).subscribe(() => {
      this.answers = new Answers(this.qs);
      this.state = 'starting';
      if (!this.ss.start) {
        this.start();
      }
    });
  }

  fontStyle(): Font {
    this.font.family = this.design.font;
    return this.font;
  }

  start(): void {
    this.state = 'started';
    if (this.qs.get.length === 0) {
      this.end();
    } else {
      this.path.push(0);
      this.progress = this.calcProgress(this.path);
    }
  }

  end(i?: number): void {
    this.state = 'ended';
    this.progress = this.calcProgress(this.path);
    if (this.es.get && typeof this.es.defaultEnd === 'number') {
      this.endScreen = -1 * (this.es.defaultEnd + 1);
      this.answers.end(-1 * (this.es.defaultEnd + 1));
    }
    if (this.es.get && typeof i === 'number') {
      this.endScreen = i;
      this.answers.end(i);
    }
    this.submitted.emit(this.answers.dbReady());
  }

  editAnswer(i: number, q: number, event: { value: Primitive; valid: boolean }): void {
    this.answers.sliceTo(q + 1);
    this.path = this.path.slice(0, i + 1);
    this.progress = this.calcProgress(this.path);

    if (event.valid) {
      this.answers.edit(q, this.qs.get[q].conf.type, event.value);
    } else {
      this.answers.splice(i, 1);
    }
  }

  goToNext(i: number, q: number): void {
    this.answers.sliceTo(i + 1);
    this.path = this.path.slice(0, i + 1);
    this.progress = this.calcProgress(this.path);
    this.answers.answered(q);
    if (this.path.length === this.n) {
      // n is counting the size of the current path
      this.n++;
      this.animateForm();
    }

    this.updater.emit(this.answers);
    const next = this.qs.get[q].next(this.answers, q) as number | 'null';

    if (next === 'null' || next >= this.qs.get.length) {
      this.end();
    } else if (next < 0) {
      this.end((next + 1) * -1);
    } else {
      this.path.push(next);
      this.progress = this.calcProgress(this.path);
    }
  }

  animateForm(): void {
    const element2 = document.getElementById('phase2');
    if (element2) element2.id = 'phase3';
    const element1 = document.getElementById('phase1');
    if (element1) element1.id = 'phase2';
  }

  editable(question: Q): boolean {
    switch (question.conf.type) {
      case QuestionType.MultipleChoiceQ:
      case QuestionType.PictureChoiceQ:
        return question.conf.allowMultiple;
      case QuestionType.StarRatingQ:
      case QuestionType.YesNoQ:
        return false;
      default:
        return true;
    }
  }

  calcProgress(path: number[]): number {
    if (this.state === 'starting') return 0;
    if (this.state === 'ended') return 100;
    const question = path[path.length - 1];
    if (question <= 0) return 0;
    const length = this.qs.get.length;
    return Math.ceil((question / length) * 100);
  }

  tryGoToNext(i: number, q: number): void {
    if (!this.answers.edited(q) && this.qs.get[q].conf.type !== this.questionTypes.TextQ) return;
    this.goToNext(i, q);
  }
}
