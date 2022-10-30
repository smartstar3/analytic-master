import { Component, Input, OnDestroy, Optional, Self } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgControl,
  NgForm,
  ValidationErrors,
  Validator,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Q, QuestionType } from '../../../question';
import { Check, Comparison, Op } from '../../logic';
import { Subscription } from 'rxjs';
import { QuestionService } from '../../../form/services/question.service';
import { PosService } from '../../../builder2/services/pos.service';
import { DescriptionService } from '../../../builder2/services/description.service';
import { Update } from '../../../builder2/services/update/update';
import { isTypeChange } from '../../../builder2/services/update/question-update';
import { ErrorStateMatcher } from '@angular/material/core';
import { ErrorService } from '../../../builder2/services/error-system/error.service';
import { Node, ErrorState } from '../../../builder2/services/error-system/tree-map';

@Component({
  selector: 'app-logic-comparison',
  templateUrl: './comparison.component.html',
  styleUrls: ['./comparison.component.scss'],
})
export class ComparisonComponent implements ControlValueAccessor, OnDestroy {
  errMatcher: ErrorMatchSystem;
  private qSub: Subscription;
  @Input()
  set comparison(check: Check) {
    if (!check) return;
    this._check.check = this.freshComparison(check.check);
    this.newControl();
  }
  private _path: string;
  @Input() set path(path: string) {
    this.errMatcher = new ErrorMatchSystem(this.err.get(path));
    this._path = path;
  }

  get errNode(): Node<ErrorState> {
    return this.err.get(this._path);
  }
  get q(): Q {
    return this.qs.get(this._check.check.q);
  }
  get val(): AbstractControl {
    return this.control ? this.control.get('val') : null;
  }
  get selected(): string | number {
    return this.control ? this.control.get('q').value : null;
  }
  checkType: CheckType = null;

  constructor(
    private fb: FormBuilder,
    public qs: QuestionService,
    @Optional() public pos: PosService,
    @Optional() public ds: DescriptionService,
    @Optional() public err: ErrorService,
    @Optional() @Self() public ngControl: NgControl
  ) {
    if (this.ngControl) this.ngControl.valueAccessor = this;
  }
  control: FormGroup;
  private valueChangesSub: Subscription;
  private statusChangesSub: Subscription;

  private _check: Check = { check: null };

  readonly ops = Op;

  private _onChange = null;

  private newControl(): void {
    if (!this.control) {
      this.control = this.fb.group(this._check.check);
      const question = this.qs.get(this.control.get('q').value);
      this.control.setControl('val', this.fb.control('', [Validators.required, ...rangeValidators(question)]));
      this.control.get('val').setValue(this._check.check.val);
      this.valueChangesSub = this.control.valueChanges.subscribe((check) => {
        if (this._onChange) this._onChange({ check });
        if (this.control.invalid && !this.errNode.value) {
          this.errNode.value = { error: 'Invalid condition' };
        } else if (this.control.valid && this.errNode.value) {
          this.errNode.value = null;
        }
      });

      this.control.get('q').setValidators([Validators.required, new ExistsValidator(this.pos).validate]);
      this.control.get('q').valueChanges.subscribe((value) => this.selectedQChange(value));

      this.control.get('negate').setValidators(Validators.required);
      if (this.qs.bqs) {
        this.qSub?.unsubscribe();
        this.qSub = this.qs.getChange(this.control.get('q').value as string).subscribe((u: Update) => {
          if (isTypeChange(u)) this.typeChange(u.to);
        });
      }
      this.checkType = checkType(this.q);
    } else {
      this.control.reset(this._check.check, { emitEvent: false });
      const question = this.qs.get(this.control.get('q').value);
      this.control.get('val').setValidators([Validators.required, ...rangeValidators(question)]);

      this.control.get('op').setValidators(Validators.required);
    }
    this.control.updateValueAndValidity();
  }
  private selectedQChange(q: number | string): void {
    this._check.check = {
      q,
      negate: false,
      val: null,
      op: defaultOp(this.qs.get(q).conf.type),
    };
    if (this.qs.bqs) {
      this.qSub?.unsubscribe();
      this.qSub = this.qs.getChange(q as string).subscribe((u: Update) => {
        if (isTypeChange(u)) this.typeChange(u.to);
      });
    }
    this.checkType = checkType(this.q);
    this.newControl();
  }

  private typeChange(to: QuestionType): void {
    this._check.check.op = defaultOp(to);
    this._check.check.val = null;
    this.checkType = checkType(this.q);
    this.newControl();
  }

  private freshComparison(comparison?: Comparison): Comparison {
    const { q, negate, val, op } = comparison ? comparison : { q: null, negate: null, val: null, op: null };
    const defaultQ = this.qs.pqs ? 0 : this.qs.bqs.order.value[0];
    return {
      q: q ? q : defaultQ,
      negate: negate ? negate : false,
      val: val !== null && val !== undefined ? val : null,
      op: op ? op : defaultOp(this.qs.get(defaultQ).conf.type),
    };
  }
  registerOnChange(fn): void {
    if (!this._onChange) {
      this._onChange = fn;
      this.control?.updateValueAndValidity();
    }
    this._onChange = fn;
  }

  private _onTouched = () => {};
  registerOnTouched(fn): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.control.disable();
    } else {
      this.control.enable();
    }
  }

  writeValue(obj): void {
    this.comparison = obj;
  }

  ngOnDestroy(): void {
    this.valueChangesSub?.unsubscribe();
    this.statusChangesSub?.unsubscribe();
    this.qSub?.unsubscribe();
  }

  choiceCompare(o1, o2): boolean {
    return o1[0] === o2[0];
  }
}

type CheckType = 'bool' | 'string' | 'number' | 'choice' | 'multi-choice';

function checkType(question: Q): CheckType {
  if (!question) return;
  switch (question.conf.type) {
    case QuestionType.EmailQ:
    case QuestionType.OpenQ:
    case QuestionType.PhoneNumberQ:
      return 'string';
    case QuestionType.NumberQ:
    case QuestionType.SliderChoiceQ:
    case QuestionType.StarRatingQ:
      return 'number';
    case QuestionType.MultipleChoiceQ:
    case QuestionType.PictureChoiceQ:
      return question.conf.allowMultiple ? 'multi-choice' : 'choice';
    case QuestionType.YesNoQ:
      return 'bool';
    default:
      throw new Error(`[CheckType] unexpected question type ${question.conf.type}`);
  }
}

export function defaultOp(type: QuestionType): Op {
  if (type === QuestionType.MultipleChoiceQ || type === QuestionType.PictureChoiceQ) {
    return Op.InclSome;
  }
  return Op.Eq;
}

function rangeValidators(q: Q): ValidatorFn[] {
  const validators: ValidatorFn[] = [];
  if (typeof q.conf.min === 'number') validators.push(Validators.min(q.conf.min));
  if (typeof q.conf.max === 'number') validators.push(Validators.max(q.conf.max));
  return validators;
}

class ErrorMatchSystem implements ErrorStateMatcher {
  constructor(private errNode: Node<ErrorState>) {}
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const alreadyShow = this.errNode.show;
    const show = !!(control?.invalid && (control?.dirty || control?.touched || alreadyShow));
    if (show === true) this.errNode.show = true;
    return show;
  }
}

class ExistsValidator implements Validator {
  constructor(private pos?: PosService) {}

  validate = (control: AbstractControl): ValidationErrors | null => {
    if (this.pos && !this.pos.exists(control.value)) {
      return { exists: 'question doesnt exist' };
    } else {
      return null;
    }
  };
}
