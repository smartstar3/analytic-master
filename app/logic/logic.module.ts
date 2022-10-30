import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConditionTreeComponent } from './condition-tree/condition-tree.component';
import { MaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ComparisonComponent } from './condition-tree/comparison/comparison.component';
import { FormModule } from '../form/form.module';
import { CdkTreeModule } from '@angular/cdk/tree';
import { StringifyConditionPipe } from './condition-tree/stringify-condition.pipe';
import { TextOnlyFilterPipe } from './test-only-filter.pipe';

@NgModule({
  declarations: [ConditionTreeComponent, ComparisonComponent, StringifyConditionPipe, TextOnlyFilterPipe],
  imports: [CommonModule, MaterialModule, ReactiveFormsModule, FormModule, CdkTreeModule],
  exports: [ConditionTreeComponent],
})
export class LogicModule {}
