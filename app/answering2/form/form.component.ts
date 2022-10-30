import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
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
import { MessengerService } from '../../messenger/messenger.service';
import { SelectionService } from '../services/selection.service';
import { CarouselService } from '../services/carousel.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  answers: Answers;
  questionList: number[] = [];
  state: 'starting' | 'started' | 'ended';
  @Output() readonly submitted: EventEmitter<DBAnswers> = new EventEmitter<DBAnswers>();
  updater: EventEmitter<Answers> = new EventEmitter<Answers>();
  design: Design = DEFAULT_DESIGN;
  endScreen: number | string;
  @ViewChild('id') el: ElementRef;
  questionTypes = QuestionType;
  progress = 0;
  touchHolder: Touch = null;
  next: string | number | 'null' = 'null';

  public font: Font = new Font({
    family: 'Arial',
    size: '16px',
    style: 'bold',
    styles: ['bold'],
  });

  @HostListener('wheel', ['$event'])
  mouseEvents(wheelEvent: WheelEvent): void {
    if (wheelEvent.deltaY > 0) {
      this.scrollToNextQuestion();
    } else if (wheelEvent.deltaY < 0) {
      this.scrollToPreviousQuestion();
    }
  }

  @HostListener('touchstart', ['$event'])
  touchStartEvent(event: TouchEvent): void {
    this.touchHolder = event.changedTouches.item(0);
  }

  @HostListener('touchend', ['$event'])
  touchEndEvent(event: TouchEvent): void {
    const lastTouch = event.changedTouches.item(0);
    if (this.touchHolder) {
      const distance = this.touchHolder.clientY - lastTouch.clientY;
      if (Math.abs(distance) >= 50) {
        if (distance > 0) {
          this.scrollToNextQuestion();
        } else {
          this.scrollToPreviousQuestion();
        }
      }
    }

    this.touchHolder = null;
  }

  constructor(
    public qs: PublishedQuestionService,
    public es: PublishedEndService,
    public ss: PublishedStartService,
    public is: InitService,
    public msgr: MessengerService,
    public selectionService: SelectionService,
    private carousel: CarouselService,
    public dialog: MatDialog
  ) {
    this.selectionService.selectedQuestionBehaviorSubject.subscribe((update) =>
      this.calculateProgress(update.selectedQuestion)
    );
  }

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
      this.questionList.push(0);
    }
  }

  end(i?: number): void {
    this.state = 'ended';
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

  goToNextQuestion(): boolean {
    const selected = this.selectionService.selectedQuestion;
    const question = this.questionList[selected];
    if (this.answers.isValid(question) || this.qs.get[question]?.conf.type === QuestionType.TextQ) {
      this.answers.answered(question);
      this.updater.emit(this.answers);
      const next = this.qs.get[question].next(this.answers, question);

      if (next === 'null' || next >= this.qs.get.length || next < 0) {
        this.next = next;
        this.turnOnSubmitButton();
        return false;
      } else {
        if (this.questionList.length === selected + 1) {
          this.questionList.push(Number(next));
        } else {
          if (this.questionList[selected + 1] !== next) {
            this.answers.sliceTo(selected + 1);
            this.questionList = this.questionList.slice(0, selected + 1);
            this.questionList.push(Number(next));
          }
        }
      }
      return true;
    } else {
      this.msgr.error('Your answer is not valid');
    }
    return false;
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

  calculateProgress(index: number): void {
    switch (this.state) {
      case 'starting':
        this.progress = 0;
        break;
      case 'ended':
        this.progress = 100;
        break;
      case 'started':
        this.progress = Math.ceil((this.questionList[index] / this.qs.get.length) * 100);
    }
  }

  scrollToNextQuestion(): void {
    if (this.state !== 'started' || !this.canScrollToNextQuestion()) return;
    if (!this.carousel.isAnimating && this.goToNextQuestion()) {
      this.selectionService.selectNextQuestion();
    }
  }

  canScrollToNextQuestion(): boolean {
    const selected = this.selectionService.selectedQuestion;
    const question = this.questionList[selected];
    if (this.carousel.showSubmitButton) return false;
    return this.answers.isValid(question) || this.qs.get[question]?.conf.type === QuestionType.TextQ;
  }

  scrollToPreviousQuestion(): void {
    if (this.state !== 'started' || !this.canScrollToPreviousQuestion()) return;
    if (!this.carousel.isAnimating) {
      this.selectionService.selectPreviousQuestion();
      this.turnOffSubmitButton();
    }
  }

  canScrollToPreviousQuestion(): boolean {
    return this.selectionService.selectedQuestion > 0;
  }

  editAnswerToQuestion(i: number, q: number, event: { value: Primitive; valid: boolean }): void {
    this.answers.edit(q, this.qs.get[q].conf.type, event.value, event.valid);
    this.turnOffSubmitButton();
  }

  onSubmit(): void {
    if (this.next === 'null' || this.next >= this.qs.get.length) {
      this.end();
    } else if (this.next < 0) {
      this.end((Number(this.next) + 1) * -1);
    }
  }

  turnOnSubmitButton(): void {
    if (!this.carousel.showSubmitButton) this.carousel.toggleSubmitButton();
  }

  turnOffSubmitButton(): void {
    if (this.carousel.showSubmitButton) this.carousel.toggleSubmitButton();
  }
}
