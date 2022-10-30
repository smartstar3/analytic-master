import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../payment/payment.service';
import { PaymentPlan } from '../../payment/paymentInfo';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss'],
})
export class PricingComponent implements OnInit {
  tabs = true;
  personalPlans: PaymentPlan[];
  businessPlans: PaymentPlan[];
  plans: [PaymentPlan[], PaymentPlan[]];
  index: number;
  features: string[] = [
    'Analytics Collection',
    'Multi-path Logic Jumps',
    '10+ Question Types',
    'Smart Information Recall',
    'Custom Link Builder',
    'Customizable Form Designs',
    'Begin & End Screens',
    'Data Analyzation Tools',
  ];

  constructor(
    private matIconRegistry: MatIconRegistry,
    private pay: PaymentService,
    private domSanitizer: DomSanitizer,
    private router: Router,
    private route: ActivatedRoute,
    private change: ChangeDetectorRef
  ) {
    this.personalPlans = this.pay.plans.filter(({ type }) => type === 'personal');
    this.businessPlans = this.pay.plans.filter(({ type }) => type === 'business');
  }

  ngOnInit(): void {
    this.plans = [this.businessPlans, this.personalPlans];
    if (this.route.snapshot.queryParams.tab) {
      if (this.route.snapshot.queryParams.tab === '0') this.tabs = true;
      if (this.route.snapshot.queryParams.tab === '1') this.tabs = false;
    }
    this.change.markForCheck();
  }

  // to switch from business tab to personal and vice versa
  // tabs is 1 if business, 0 if personal
  onClick(plan: string): void {
    this.tabs = plan === 'business';
  }

  async redirectUser(plan?: string): Promise<void> {
    if (!plan || plan === 'free') {
      await this.router.navigate(['/register']);
    } else {
      await this.router.navigate([`/register`], {
        queryParams: { plan },
      });
    }
  }
}
