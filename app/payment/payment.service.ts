import { Injectable } from '@angular/core';
import { PaymentFormValue, PaymentPlan } from './paymentInfo';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
/**
 * The PaymentService contains all the data and methods necessary to create, view, edit and stop payments
 */
export class PaymentService {
  readonly plans: PaymentPlan[] = [
    {
      title: 'free',
      subtitle: 'Free forever',
      price: '0',
      priceYearly: '0',
      details: ['1 ', '1 ', '5 ', '100 '],
      type: 'personal',
    },
    {
      title: 'personal',
      subtitle: 'More forms, More feedback',
      price: '19.99',
      priceYearly: '227.99',
      details: ['1 ', '3 ', '10 ', '300 '],
      type: 'personal',
    },
    {
      title: 'pro',
      subtitle: 'Full access to our analytical suite',
      price: '39.99',
      priceYearly: '455.99',
      details: ['1 ', '8 ', '20 ', '800 '],
      type: 'personal',
    },
    {
      title: 'starter',
      subtitle: 'Everything you need for a small team',
      price: '95.99',
      priceYearly: '1095.99',
      details: [' 3 ', '10 ', '30 ', '1000 '],
      type: 'business',
    },
    {
      title: 'business',
      subtitle: 'Just right for medium-sized businesses',
      price: '185.99',
      priceYearly: '2119.99',
      details: [' 7 ', '15 ', '50 ', '3000 '],
      type: 'business',
    },
    {
      title: 'enterprise',
      subtitle: 'A true enterprise solution',
      price: '425.99',
      priceYearly: '4855.99',
      details: [' 20 ', '40 ', '120 ', '6000 '],
      type: 'business',
    },
  ];

  constructor(private api: ApiService) {}

  // manage payments
  createNewSubscription(paymentInfo: PaymentFormValue): Observable<void> {
    return this.api.postRequest<void>(paymentInfo, ['subscriptions']);
  }

  activateNewSubscription(): Observable<string> {
    return this.api.getRequest<string>(['subscriptions', 'activate']);
  }
}
