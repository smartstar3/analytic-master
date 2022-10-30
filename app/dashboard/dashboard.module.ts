import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { RootComponent } from './root/root.component';
import {
  SettingsComponent,
  ConfirmationDialogComponent,
  GetUserDialogComponent,
  ChangePasswordDialogComponent,
} from './settings/settings.component';
import { BillingComponent } from './billing/billing.component';
import { MaterialModule } from './material.module';
import { MessengerModule } from '../messenger/messenger.module';
import { HttpClientModule } from '@angular/common/http';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChangeCompanyLinkDialogComponent } from './settings/change-company-link-dialog/change-company-link-dialog.component';
import { FlexModule } from '@angular/flex-layout';
import { TooltipColorPipe } from './form-list/tooltip-color.pipe';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PaymentCompletedDialogComponent } from './billing/payment-completed-dialog/payment-completed-dialog.component';
import { FormListComponent, GetNameDialogComponent } from './form-list/form-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    RootComponent,
    BillingComponent,
    SettingsComponent,
    FormListComponent,
    GetNameDialogComponent,
    ConfirmationDialogComponent,
    GetUserDialogComponent,
    ChangePasswordDialogComponent,
    ChangeCompanyLinkDialogComponent,
    TooltipColorPipe,
    PaymentCompletedDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    DashboardRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    MessengerModule,
    HttpClientModule,
    MatTooltipModule,
    FlexModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    MatTableModule,
    MatProgressSpinnerModule,
  ],
  exports: [SettingsComponent],
})
export class DashboardModule {}
