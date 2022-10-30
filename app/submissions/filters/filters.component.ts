import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Condition } from '../../logic/logic';
import { ConditionTreeComponent } from '../../logic/condition-tree/condition-tree.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Filter } from '../../api/api.service';
import { FilterErrorService } from './filter-error.service';
import { ErrorService } from '../../builder2/services/error-system/error.service';
import { MessengerService } from '../../messenger/messenger.service';
import { QuestionService } from '../../form/services/question.service';

@Component({
  selector: 'app-filters-component',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
  providers: [{ provide: ErrorService, useClass: FilterErrorService }],
})
export class FiltersComponent {
  control: FormGroup;
  applied = true;

  result: Filter;

  @ViewChild('tree') tree: ConditionTreeComponent;
  public qs: QuestionService;

  constructor(
    public ref: MatDialogRef<FiltersComponent>,
    public err: ErrorService,
    @Inject(MAT_DIALOG_DATA) public data: { filter: Filter; apply: (filter: Filter) => void },
    private fb: FormBuilder,
    private msg: MessengerService
  ) {
    this.result = { ...this.data.filter };
    this.control = this.fb.group({
      name: this.fb.control(this.result.name, Validators.required),
    });
    this.control.get('name').valueChanges.subscribe((name: string) => (this.result.name = name));
  }

  conditionChange(condition: Condition): void {
    if (!condition) return;
    this.result.data = condition;
    this.applied = false;
    this.control.updateValueAndValidity();
  }

  apply(): void {
    if (!this.err.valid() || this.control.get('name').invalid) {
      this.msg.error('Invalid filter', 1000);
      return;
    }
    this.applied = true;
    this.data.apply(this.result);
  }

  save(): void {
    if (!this.err.valid() || this.control.get('name').invalid) {
      this.msg.error('Invalid filter', 1000);
      return;
    }
    this.ref.close(this.result);
  }
}
