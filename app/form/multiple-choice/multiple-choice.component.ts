import { Component, OnDestroy, OnInit } from '@angular/core';
import { QuestionComponent } from '../question/question.component';
import { Subscription } from 'rxjs';
import { Update } from '../../builder2/services/update/update';
import { isChoiceAdd, isChoiceDelete } from '../../builder2/services/update/question-update';

@Component({
  selector: 'app-multiple-choice',
  templateUrl: './multiple-choice.component.html',
  styleUrls: ['./multiple-choice.component.scss'],
})
export class MultipleChoiceComponent extends QuestionComponent<number[]> implements OnInit, OnDestroy {
  sub: Subscription;

  selected: boolean[] = [];

  ngOnInit(): void {
    const size = this.question.conf.choices.length;
    this.selected = genFalseArr(size);
    this.answer?.forEach((value) => (this.selected[value] = true));
    if (typeof this.qid === 'string') {
      this.sub = this.qs?.getChange(this.qid)?.subscribe((u: Update) => {
        if (isChoiceDelete(u)) {
          const deleted = this.selected.splice(u.pos, 1);
          if (deleted[0]) this.updateAnswer(); // if a selected answer is deleted, update.
        }
        if (isChoiceAdd(u)) this.selected.push(false);
      });
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  select(i: number): void {
    if (this.disabled) return;
    // if !allowMultiple clear the selected choices when selecting a second choice.
    if (!this.question.conf.allowMultiple && this.answer?.length > 0 && !this.selected[i]) {
      this.clearSelected();
    }
    this.selected[i] = !this.selected[i];
    this.updateAnswer();
  }

  updateAnswer(): void {
    this.answer = [];
    this.selected.forEach((selected: boolean, i: number) => {
      if (selected) this.answer.push(i);
    });

    this.changed.emit({ value: this.answer, valid: this.answer.length > 0 });
    if (!this.question.conf.allowMultiple) {
      if (this.answer.length > 0) {
        this.answered.emit();
      }
    }
  }

  clearSelected(): void {
    this.selected = genFalseArr(this.selected.length);
  }
}

function genFalseArr(size: number): boolean[] {
  const arr: boolean[] = [];
  for (let i = 0; i < size; i++) {
    arr.push(false);
  }
  return arr;
}
