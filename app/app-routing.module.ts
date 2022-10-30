import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { PaymentGuard } from './payment/payment.guard';

export const routes: Routes = [
  {
    path: 'dash',
    loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'data',
    loadChildren: () => import('./submissions/submissions.module').then((m) => m.SubmissionsModule),
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'pay',
    loadChildren: () => import('./payment/payment.module').then((m) => m.PaymentModule),
    canActivate: [PaymentGuard],
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'f',
    loadChildren: () => import('./answering2/answering.module').then((m) => m.AnsweringModule),
  },
  {
    path: 'f2',
    loadChildren: () => import('./answering/answering.module').then((m) => m.AnsweringModule),
  },
  {
    path: 'b',
    loadChildren: () => import('./builder2/builder.module').then((m) => m.BuilderModule),
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'share',
    loadChildren: () => import('./share-center/share-center.module').then((m) => m.ShareCenterModule),
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always',
  },
  {
    path: '',
    loadChildren: () => import('./splash/splash.module').then((m) => m.SplashModule),
  },
  { path: '**', redirectTo: 'notfound' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload',
      scrollPositionRestoration: 'enabled',
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
