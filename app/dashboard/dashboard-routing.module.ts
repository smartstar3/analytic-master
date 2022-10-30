import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RootComponent } from './root/root.component';
import { BillingComponent } from './billing/billing.component';
import { SettingsComponent } from './settings/settings.component';
import { FormListComponent } from './form-list/form-list.component';
import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: RootComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        component: FormListComponent,
        data: { showState: true, states: ['unpublished', 'published'] },
      },
      {
        path: 'archived',
        component: FormListComponent,
        data: { showState: false, states: ['archived'] },
      },
      { path: 'billing', component: BillingComponent },
      { path: 'settings', component: SettingsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
