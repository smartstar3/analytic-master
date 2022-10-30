import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { QuestionComponent } from '../question/question.component';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { QuestionService } from '../services/question.service';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss'],
})
export class StarRatingComponent extends QuestionComponent<number> implements OnInit {
  selected: number;
  hoverSelected: number;
  box: number;
  hoverBox: number;
  mouseEnter = false;
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    protected qs: QuestionService
  ) {
    super(qs);
    this.loadSVG();
  }
  ngOnInit(): void {
    if (this.answer) {
      this.selected = this.answer;
      this.box = (100 * this.selected) / this.question.conf.max;
      this.background(this.selected, false);
    }

    if (!this.question.conf.rating) {
      this.question.conf.rating = 'star';
    }
  }
  loadSVG(): void {
    let i: number;
    for (i = 1; i <= 10; i++) {
      this.matIconRegistry.addSvgIcon(
        `${i}`,
        this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/img/emoticonRating/' + `${i}` + '.svg')
      );
    }
  }
  SVGIcon(i: number): number {
    const rating = i / this.question.conf.max;
    const exactlyNeutralRating = this.question.conf.max / 2;
    if (rating <= exactlyNeutralRating) return Math.floor(rating * 10) + 1;
    return Math.ceil(rating * 10) + 1;
  }

  select(i: number): void {
    if (this.disabled) return;
    this.selected = i;
    this.box = (100 * i) / this.question.conf.max;
    if (i === this.answer) {
      this.answer = undefined;
    } else {
      this.answer = i;
    }
    this.changed.emit({ value: this.answer, valid: typeof this.answer === 'number' });
    if (typeof this.answer === 'number') {
      this.answered.emit();
    }
  }
  onHover(i: number): void {
    if (this.disabled) return;
    this.hoverSelected = i;
    this.hoverBox = (100 * i) / this.question.conf.max;
    this.mouseEnter = true;
  }
  afterHover(): void {
    this.background(this.selected, false);
    this.mouseEnter = false;
  }
  opacity(i: number, hover: boolean): string {
    let x = -1;
    if (hover && i < this.hoverSelected) x = this.hoverBox;
    else if (i < this.selected) x = this.box;
    if (x !== -1) {
      return '100%';
    }
    return '35%';
  }
  background(i: number, hover: boolean): string {
    let x = -1;
    if (hover && i < this.hoverSelected) x = this.hoverBox;
    else if (i < this.selected) x = this.box;
    if (x !== -1) {
      if (x <= 10) return '#ff0000';
      if (x <= 20) return '#f74300';
      if (x <= 30) return '#ec6200';
      if (x <= 40) return '#de7b00';
      if (x <= 50) return '#cc9000';
      if (x <= 60) return '#b8a200';
      if (x <= 70) return '#a0b200';
      if (x <= 80) return '#84c100';
      if (x <= 90) return '#60cf00';
      if (x <= 100) return '#12db27';
    }
  }
}
@Pipe({ name: 'filled' })
export class FilledPipe implements PipeTransform {
  transform(answer: number, i: number): boolean {
    return i < answer;
  }
}
@Pipe({ name: 'loop' })
export class LoopPipe implements PipeTransform {
  transform(i: number): void[] {
    if (i > 10) i = 10;
    if (i < 1) i = 1;
    return new Array(i) as void[];
  }
}
