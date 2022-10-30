import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, Validators, ValidatorFn } from '@angular/forms';
import { QuestionComponent } from '../question/question.component';
import { QuestionService } from '../services/question.service';
import { Subscription } from 'rxjs';
import { Update } from '../../builder2/services/update/update';
import { isMaxChange, isMinChange } from '../../builder2/services/update/question-update';

@Component({
  selector: 'app-number',
  templateUrl: './number.component.html',
  styleUrls: ['./number.component.scss'],
})
export class NumberComponent extends QuestionComponent<number> implements OnInit, OnChanges {
  control: FormControl = new FormControl();
  sub: Subscription;

  constructor(public qs: QuestionService) {
    super(qs);
  }

  edited(i: number): void {
    this.changed.emit({ value: i, valid: this.control.valid });
  }

  setControl(): void {
    const validators: ValidatorFn[] = [Validators.required];
    if (this.question.conf.min !== null) validators.push(Validators.min(this.question.conf.min));
    if (this.question.conf.max !== null) validators.push(Validators.max(this.question.conf.max));
    this.control.setValidators(validators);
    this.control.updateValueAndValidity();
  }

  ngOnInit(): void {
    this.setControl();
  }

  ngOnChanges(changes: SimpleChanges): void {
    super.ngOnChanges(changes);
    if (!Object.prototype.hasOwnProperty.call(changes, 'qid') || typeof this.qid !== 'string') return;
    this.sub?.unsubscribe();
    this.sub = this.qs.getChange(this.qid).subscribe((u: Update) => {
      if (isMinChange(u) || isMaxChange(u)) this.setControl();
    });
  }
}
