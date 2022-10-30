import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiService } from '../../../api/api.service';
import { debounceTime, distinctUntilChanged, first, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-change-company-link-dialog',
  templateUrl: './change-company-link-dialog.component.html',
  styleUrls: ['./change-company-link-dialog.component.scss'],
})
export class ChangeCompanyLinkDialogComponent {
  prefix = 'https://feedback-analytics.com/f/';
  suffix = '/abc123';
  currentLink = 'Loading...';
  newLink: AbstractControl;
  confirmLink: AbstractControl;

  changeCompanyLinkForm = new FormGroup({
    newCompanyLink: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3), Validators.pattern('[a-z0-9-]+')],
      asyncValidators: this.shareLinkAsyncValidator(),
      updateOn: 'blur',
    }),
    retypedCompanyLink: new FormControl('', [Validators.required, this.confirmLinkValidator()]),
  });

  constructor(
    public dialogRef: MatDialogRef<ChangeCompanyLinkDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { companyLink: string },
    private api: ApiService
  ) {
    this.newLink = this.changeCompanyLinkForm.get('newCompanyLink');
    this.confirmLink = this.changeCompanyLinkForm.get('retypedCompanyLink');
    this.currentLink = this.data.companyLink;
  }

  confirmLinkValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const link = control.root.get('newCompanyLink');
      return link && control && link.value === control.value ? null : { confirm: true };
    };
  }

  shareLinkAsyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors> | null => {
      return control.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((val) => this.api.pollCompanyLinks(val)),
        map((exists) => (exists ? { taken: true } : null)),
        first()
      );
    };
  }

  saveCompanyLink(): void {
    this.confirmLink.updateValueAndValidity();

    if (this.changeCompanyLinkForm.valid) {
      this.dialogRef.close({
        newCompanyLink: String(this.changeCompanyLinkForm.get('newCompanyLink').value),
      });
    }
  }

  noClick(): void {
    this.dialogRef.close();
  }

  disable($event: MouseEvent): void {
    $event.preventDefault();
  }
}
