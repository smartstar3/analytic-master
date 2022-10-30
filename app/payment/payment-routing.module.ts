import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';
import { RootComponent } from './root/root.component';
import { PaymentComponent } from './payment/payment.component';
import { SuccessComponent } from './success/success.component';

export const routes: Routes = [
  {
    path: '',
    component: RootComponent,
    canActivateChild: [AuthGuard],
    children: [
      { path: '', component: PaymentComponent },
      { path: 'success', component: SuccessComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentRoutingModule {}
