import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { MessengerService } from '../../messenger/messenger.service';
import { PaymentService } from '../payment.service';
import { Interval, PaymentFormValue, PaymentPlan, Plan } from '../paymentInfo';
import countries from '../../../assets/data/countries.json';
import { ApiService } from '../../api/api.service';

export interface Country {
  name: string;
  code: string;
}

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  detail = false;
  planName: string;
  plan: PaymentPlan;
  countryList: Country[];
  paymentForm = this.fb.group({
    paymentInfo: this.fb.group({
      plan: [``, Validators.required],
      interval: ['', Validators.required],
    }),
    general: this.fb.group({
      gender: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      telephone: ['', Validators.required],
    }),
    company: this.fb.group({
      companyName: [''],
      vatNumber: [''],
    }),
    address: this.fb.group({
      postalcode: ['', Validators.required],
      houseNumber: ['', Validators.required],
      houseNumberAdd: [''],
      street: ['', Validators.required],
      city: ['', Validators.required],
      countryIso2: ['', Validators.required],
      // state: ['', Validators.required],
    }),
    language: ['en'],
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private msgr: MessengerService,
    private pay: PaymentService,
    private api: ApiService
  ) {
    const paramMap = convertToParamMap(this.route.snapshot.queryParams);
    this.planName = paramMap.get('plan');
  }

  ngOnInit(): void {
    this.plan = this.pay.plans.filter(({ title }) => title === this.planName)[0];
    this.countryList = countries;
    this.api.getCompanyDetail().subscribe(
      (data) => {
        data.paymentInfo = {
          plan: this.paymentForm.get('paymentInfo.plan').value as Plan,
          interval: this.paymentForm.get('paymentInfo.interval').value as Interval,
        };
        this.paymentForm.setValue(data);
      },
      () => {
        // do nothing
      }
    );
    this.paymentForm.get('paymentInfo.plan').setValue(this.planName);
  }

  onSubmit(): void {
    this.createPaymentLink();
  }

  price(type: 'monthly' | 'yearly'): string | number {
    if (type === 'yearly') return this.plan?.priceYearly;
    return this.plan?.price;
  }

  tag(type: 'monthly' | 'yearly'): string {
    if (type === 'yearly') return 'year';
    return 'month';
  }

  details(): void {
    this.detail = !this.detail;
  }

  createPaymentLink(): void {
    const paymentDetails: PaymentFormValue = this.paymentForm.value as PaymentFormValue;

    this.api.createCompanyDetail(paymentDetails).subscribe(
      () => {
        this.pay.createNewSubscription(paymentDetails).subscribe(
          () => {
            this.pay.activateNewSubscription().subscribe(
              (confirmationPage) => (window.location.href = confirmationPage),
              (err) => this.msgr.httpErrorHandler(err, 'something went wrong while getting the payment link')
            );
          },
          (err) => this.msgr.httpErrorHandler(err, 'something went wrong while creating the payment')
        );
      },
      (err) => this.msgr.httpErrorHandler(err, 'something went wrong while setting your info')
    );
  }
}
