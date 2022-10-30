import { Component, OnChanges, OnInit } from '@angular/core';
import { QuestionComponent } from '../question/question.component';
import { QuestionService } from '../services/question.service';
import { AbstractControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StringMap } from '../../logic/logic';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../api/api.service';

@Component({
  selector: 'app-address-question',
  templateUrl: './address-question.component.html',
  styleUrls: ['./address-question.component.scss'],
})
export class AddressQuestionComponent extends QuestionComponent<Address> implements OnInit, OnChanges {
  formGroup: FormGroup;
  types: string | number;
  receivedApiData: boolean;

  constructor(
    public qs: QuestionService,
    private fb: FormBuilder,
    private httpClient: HttpClient,
    private api: ApiService
  ) {
    super(qs);
  }
  ngOnInit(): void {
    if (!this.answer) {
      this.answer = {
        city: '',
        street: '',
        houseNumber: '',
        postalCode: '',
      };
    }
    this.formGroup = this.fb.group(this.answer, { updateOn: 'blur' });
    this.receivedApiData = true;

    if (!this.disabled) {
      this.formGroup
        .get('houseNumber')
        .setValidators([Validators.required, Validators.pattern('^([0-9]){1,4}([a-zA-Z]){0,2}')]);
      this.formGroup
        .get('postalCode')
        .setValidators([Validators.required, Validators.pattern('^([0-9]){4}(\\s){0,1}([A-Z]){2}')]);

      this.formGroup.valueChanges.subscribe(() => this.updateAnswer());
    }
  }

  // Getters for FormControls from FormGroup
  get houseNumber(): AbstractControl {
    return this.formGroup.get('houseNumber');
  }
  get postalCode(): AbstractControl {
    return this.formGroup.get('postalCode');
  }

  updateAnswer(): void {
    if (this.formGroup.valid) {
      this.edited();
    }
  }
  edited(): void {
    // Remove whitespaces from the answers from the FormGroup and set answer's fields
    this.answer.postalCode = (this.formGroup.get('postalCode').value as string).replace(/\s/g, '');
    this.answer.houseNumber = (this.formGroup.get('houseNumber').value as string).replace(/\s/g, '');

    this.fetchAddressFromApi();
    this.changed.emit({ value: this.answer, valid: this.formGroup.valid });
  }
  fetchAddressFromApi(): void {
    this.api
      .getAddress(this.answer.postalCode, this.answer.houseNumber)
      .subscribe((address) => this.checkApiResults(address));
  }
  checkApiResults(address: Address): void {
    if (address != null) {
      this.receivedApiData = true;
      this.answer = address;
    }
  }
}

export interface Address extends StringMap {
  city: string;
  street: string;
  houseNumber: string;
  postalCode: string;
}
