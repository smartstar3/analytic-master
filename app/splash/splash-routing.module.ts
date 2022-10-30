import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RootComponent } from './root/root.component';
import { AboutComponent } from './about/about.component';
import { PricingComponent } from './pricing/pricing.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { LoginGuard } from './login/login.guard';
import { RegisterComponent } from './register/register.component';
import { SolutionsComponent } from './solutions/solutions.component';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PrivacyPolicyComponent } from './policies/privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './policies/terms-and-conditions/terms-and-conditions.component';
import { CookiesPolicyComponent } from './policies/cookies-policy/cookies-policy.component';
import { HelpCenterComponent } from './help-center/help-center/help-center.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ThankYouComponent } from './thank-you/thank-you.component';
import { IframeComponent } from './iframe/iframe.component';

export const routes: Routes = [
  { path: 'thank-you', component: ThankYouComponent },
  { path: 'iframe', component: IframeComponent },
  {
    path: '',
    component: RootComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'home', component: HomeComponent },
      { path: 'about', component: AboutComponent },
      { path: 'help', component: HelpCenterComponent },
      {
        path: 'help-center',
        loadChildren: () => import('./help-center/help-center.module').then((m) => m.HelpCenterModule),
      },
      { path: 'pricing', component: PricingComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
      {
        path: 'register',
        component: RegisterComponent,
        canActivate: [LoginGuard],
      },
      { path: 'reset', component: PasswordResetComponent },
      { path: 'forgot', component: ForgotPasswordComponent, canActivate: [LoginGuard] },
      { path: 'solutions', component: SolutionsComponent },
      { path: 'verify', component: EmailVerificationComponent },
      { path: 'notfound', component: PageNotFoundComponent },
      { path: 'privacy-policy', component: PrivacyPolicyComponent },
      { path: 'terms-and-conditions', component: TermsAndConditionsComponent },
      { path: 'cookies-policy', component: CookiesPolicyComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SplashRoutingModule {}
