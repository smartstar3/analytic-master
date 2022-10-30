import { Component, OnInit } from '@angular/core';
import { User } from '../../api/user';
import { MessengerService } from '../../messenger/messenger.service';
import { PaymentPlan } from '../../payment/paymentInfo';
import { PaymentService } from '../../payment/payment.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { ApiService } from '../../api/api.service';
import { Company } from '../../api/company';
import { SubscriptionInfo } from '../../payment/success/success.component';

interface Feature {
  title?: string;
  progress: number;
  currentAmount: number;
  maxAmount: number;
}

export interface Usage {
  usersUsage: Feature;
  activeFormsUsage: Feature;
  formsUsage: Feature;
  responsesUsage: Feature;
}

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
})
export class BillingComponent implements OnInit {
  queryParams: Params;
  user: User;
  plan: PaymentPlan;
  // dataSource: DataSource<any>;
  displayedColumns: string[];
  company: Company;
  usage: Usage;
  subscriptions: SubscriptionInfo[];

  constructor(
    private api: ApiService,
    private pay: PaymentService,
    private msgr: MessengerService,
    public dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this.subscriptions = [];
    this.queryParams = this.route.snapshot.queryParams;
    this.displayedColumns = ['status', 'date', 'plan', 'amount', 'invoice'];
    this.plan = this.pay.plans[0];
  }

  ngOnInit(): void {
    this.getStats();
  }

  getStats(): void {
    this.api.getOwnCompany().subscribe(
      (company) => {
        // company.plan = 'free';
        this.company = company;
      },
      (err) => {
        this.msgr.httpErrorHandler(err, 'something went wrong when trying to get your user account info');
      }
    );

    this.api.getUsageStatistics().subscribe(
      (usage) => {
        this.usage = usage;
      },
      (err) => {
        this.msgr.httpErrorHandler(err, 'something went wrong when trying to get your user account info');
      }
    );

    this.api.getSubscription().subscribe(
      (subs) => {
        this.subscriptions = subs;
      },
      () => {
        this.subscriptions = [];
      }
    );
  }

  onCancel(): void {
    this.api.cancelSubscription().subscribe(
      () => this.getStats(),
      () => this.getStats()
    );
  }

  onResume(): void {
    this.api.resumeSubscription().subscribe(
      () => this.getStats(),
      () => this.getStats()
    );
  }

  onActivate(): void {
    this.pay.activateNewSubscription().subscribe(
      (confirmationPage) => (window.location.href = confirmationPage),
      (err) => this.msgr.httpErrorHandler(err, 'something went wrong while getting the payment link')
    );
  }
}
