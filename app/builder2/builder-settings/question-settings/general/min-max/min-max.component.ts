import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { QuestionService } from '../../../../services/question.service';
import { MaxChange, MinChange } from '../../../../services/update/question-update';
import { UpdateType } from '../../../../services/update/update';
import { SelectionService } from '../../../../services/selection.service';
import { ErrorService } from '../../../../services/error-system/error.service';
import { Node, ErrorState } from '../../../../services/error-system/tree-map';
import { ErrorStateMatcher } from '@angular/material/core';
import { Subscription } from 'rxjs';
import { ErrorSystemMatcher } from '../../../../services/error-system/error-system-matcher';
import { QuestionType } from '../../../../../question';

enum Change {
  max = 'max',
  min = 'min',
}

@Component({
  selector: 'app-build-min-max',
  templateUrl: './min-max.component.html',
  styleUrls: ['./min-max.component.scss'],
})
export class MinMaxComponent implements OnInit, OnDestroy {
  private selSub: Subscription;
  private minSub: Subscription;
  private maxSub: Subscription;

  minControl = new FormControl();
  maxControl = new FormControl();
  minErrMatcher: ErrorStateMatcher;
  maxErrMatcher: ErrorStateMatcher;

  get minError(): Node<ErrorState> {
    return this.err.get(`questions.${this.sel.id}.min`);
  }
  get maxError(): Node<ErrorState> {
    return this.err.get(`questions.${this.sel.id}.max`);
  }

  get min(): number {
    return this.qs.get[this.sel.id].conf.min;
  }
  get max(): number {
    return this.qs.get[this.sel.id].conf.max;
  }

  get type(): number {
    return this.qs.get[this.sel.id].conf.type;
  }

  constructor(public qs: QuestionService, public sel: SelectionService, private err: ErrorService) {
    this.selSub = this.sel.change.subscribe(() => {
      this.setup();
    });
  }

  teardown(): void {
    this.selSub?.unsubscribe();
    this.minSub?.unsubscribe();
    this.maxSub?.unsubscribe();
  }

  setup(): void {
    this.showErrState();
    this.minErrMatcher = new ErrorSystemMatcher(this.minError);
    this.maxErrMatcher = new ErrorSystemMatcher(this.maxError);
    this.minControl.setValue(this.min);
    this.maxControl.setValue(this.max);
  }

  ngOnInit(): void {
    this.minSub = this.minControl.valueChanges.subscribe((min: number) => this.changeMin(min));
    this.maxSub = this.maxControl.valueChanges.subscribe((max: number) => this.changeMax(max));
    this.setup();
  }

  ngOnDestroy(): void {
    this.teardown();
  }

  numberQuestionValidator(change: Change): boolean {
    if (
      this.minControl.value === null ||
      this.minControl.value === undefined ||
      this.maxControl.value === null ||
      this.maxControl.value === undefined
    ) {
      this.minError.value = null;
      this.maxError.value = null;
      return true;
    }

    return this.validate(change);
  }

  sliderQuestionValidator(change: Change): boolean {
    if (this.minControl.value === null || this.minControl.value === undefined) {
      this.minError.value = { error: 'A number is required' };
      return false;
    }

    if (this.maxControl.value === null || this.maxControl.value === undefined) {
      this.maxError.value = { error: 'A number is required' };
      return false;
    }

    return this.validate(change);
  }

  validate(change: Change): boolean {
    this.minError.value = null;
    this.maxError.value = null;

    const err = this.maxControl.value < this.minControl.value;

    if (err) {
      if (change === Change.max) {
        this.maxError.value = { error: 'max cannot be less than min' };
      } else {
        this.minError.value = { error: 'min cannot be more than max' };
      }
      return false;
    }
    return true;
  }

  changeMax(max: number): void {
    let valid: boolean;
    this.type === QuestionType.SliderChoiceQ
      ? (valid = this.sliderQuestionValidator(Change.max))
      : (valid = this.numberQuestionValidator(Change.max));
    if (valid) {
      this.qs.get[this.sel.id].conf.max = max;
      this.qs.update<MaxChange>({ max, type: UpdateType.MaxChange }, this.sel.id);
    }
  }

  changeMin(min: number): void {
    let valid: boolean;
    this.type === QuestionType.SliderChoiceQ
      ? (valid = this.sliderQuestionValidator(Change.min))
      : (valid = this.numberQuestionValidator(Change.min));
    if (valid) {
      this.qs.get[this.sel.id].conf.min = min;
      this.qs.update<MinChange>({ min, type: UpdateType.MinChange }, this.sel.id);
    }
  }

  showErrState(): void {
    this.minError.show = true;
    this.maxError.show = true;
  }
}
