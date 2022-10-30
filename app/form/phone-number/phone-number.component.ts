import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { QuestionComponent } from '../question/question.component';
import { ValidatorFn, AbstractControl } from '@angular/forms';
import { PhoneNumberUtil } from 'google-libphonenumber';

@Component({
  selector: 'app-phone-number',
  templateUrl: './phone-number.component.html',
  styleUrls: ['./phone-number.component.scss'],
})
export class PhoneNumberComponent extends QuestionComponent<string> implements OnInit {
  control: FormControl = new FormControl('', [Validators.required, PhoneNumberValidator()]);

  ngOnInit(): void {
    if (this.disabled) {
      this.control.setValidators([]);
    }
  }

  edited(phone: string): void {
    this.changed.emit({ value: phone, valid: this.control.valid });
  }
}

const phoneNumberUtil = PhoneNumberUtil.getInstance();

export function PhoneNumberValidator(regionCode?: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: unknown } => {
    if (!control.value) return null;
    let validNumber = false;
    try {
      const phoneNumber = phoneNumberUtil.parseAndKeepRawInput(control.value, regionCode);
      validNumber = phoneNumberUtil.isValidNumber(phoneNumber);
    } catch (e) {
      // do nothing
    }

    return validNumber ? null : { phoneNumber: { value: control.value as unknown } };
  };
}
