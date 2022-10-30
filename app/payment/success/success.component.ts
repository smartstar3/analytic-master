import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api/api.service';

export interface SubscriptionInfo {
  status: string;
  plan: string;
  interval: string;
  companyId: number;
  id: number;
  cancelledAt: string;
  validUntil: string;
}

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss'],
})
export class SuccessComponent implements OnInit {
  subscriptions: SubscriptionInfo[];

  constructor(private api: ApiService) {
    this.subscriptions = [];
  }

  ngOnInit(): void {
    this.api.checkSubscription().subscribe(
      () => this.getSubs(),
      () => this.getSubs()
    );
  }

  getSubs(): void {
    this.api.getSubscription().subscribe(
      (subs) => (this.subscriptions = subs),
      () => (this.subscriptions = [])
    );
  }
}
