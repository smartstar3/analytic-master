import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Field, VariableField } from '../../root/root.component';

@Component({
  selector: 'app-select-field-dialog',
  templateUrl: 'select-field-dialog.component.html',
  styleUrls: ['./select-field-dialog.component.scss'],
})
export class SelectFieldDialogComponent implements OnInit {
  field: Field = {
    nameField: '',
    emailField: '',
    otherFields: [],
  };
  variableForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<SelectFieldDialogComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: string[]
  ) {
    this.variableForm = this.formBuilder.group({
      name: ['', Validators.required],
      field: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.data[0]) {
      this.field.nameField = this.data[0];
      this.field.emailField = this.data[0];
    }
  }

  handleClose(): void {
    this.dialogRef.close();
  }

  onVariableForm(data: VariableField): void {
    this.field.otherFields.push(data);
    this.variableForm.reset();
  }

  removeVariable(index: number): void {
    this.field.otherFields.splice(index, 1);
  }
}
