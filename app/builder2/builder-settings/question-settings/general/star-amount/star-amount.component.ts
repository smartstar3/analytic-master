import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { QuestionService } from '../../../../services/question.service';
import { MaxChange } from '../../../../services/update/question-update';
import { UpdateType } from '../../../../services/update/update';
import { SelectionService } from '../../../../services/selection.service';
import { Subscription } from 'rxjs';
import { ErrorStateMatcher } from '@angular/material/core';
import { ErrorState, Node } from '../../../../services/error-system/tree-map';
import { ErrorService } from '../../../../services/error-system/error.service';
import { ErrorSystemMatcher } from '../../../../services/error-system/error-system-matcher';

@Component({
  selector: 'app-build-star-amount',
  templateUrl: './star-amount.component.html',
  styleUrls: ['./star-amount.component.scss'],
})
export class StarAmountComponent implements OnInit, OnDestroy {
  control: FormControl = new FormControl();

  private selSub: Subscription;
  private sub: Subscription;

  errMatcher: ErrorStateMatcher;

  get error(): Node<ErrorState> {
    return this.err.get(`questions.${this.sel.id}.max`);
  }

  get value(): number {
    return this.qs.get[this.sel.id].conf.max;
  }

  constructor(public qs: QuestionService, public sel: SelectionService, private err: ErrorService) {
    this.selSub = this.sel.change.subscribe(() => {
      this.setup();
    });
  }

  teardown(): void {
    this.selSub?.unsubscribe();
    this.sub?.unsubscribe();
  }

  setup(): void {
    this.showErrState();
    this.errMatcher = new ErrorSystemMatcher(this.error);
    this.value ? this.control.setValue(this.value) : this.control.setValue(5);
  }

  ngOnInit(): void {
    this.sub = this.control.valueChanges.subscribe((value: number) => this.change(value));
    this.setup();
  }

  ngOnDestroy(): void {
    this.teardown();
  }

  // this.error.value being changed just pisses off angular change detection. find alternative.
  validate(value: number): boolean {
    this.error.value = null;

    if (value === null || value === undefined) {
      this.error.value = { error: 'Input required' };
      return false;
    }

    if (value > 10) this.error.value = { error: 'Amount of stars cannot be more than 10' };
    else if (value < 5) this.error.value = { error: 'Amount of stars cannot be less than 5' };
    else {
      return true;
    }
    return false;
  }

  change(value: number): void {
    if (this.validate(value)) {
      this.qs.get[this.sel.id].conf.max = value;
      this.qs.update<MaxChange>({ max: value, type: UpdateType.MaxChange }, this.sel.id);
    }
  }

  showErrState(): void {
    this.error.show = true;
  }
}
