import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SplashRoutingModule } from './splash-routing.module';
import { RootComponent } from './root/root.component';
import { AboutComponent } from './about/about.component';
import { PricingComponent } from './pricing/pricing.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { FooterComponent } from './footer/footer.component';
import { MaterialModule } from './material.module';
import { LoginGuard } from './login/login.guard';
import { HttpClientModule } from '@angular/common/http';
import { CardsModule } from 'angular-bootstrap-md';
import { SideNavComponent } from './side-nav/side-nav.component';
import { ExtendedModule, FlexLayoutModule } from '@angular/flex-layout';
import { RegisterComponent } from './register/register.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SolutionsComponent } from './solutions/solutions.component';
import { SanitizerPipe, SanitizerStyle } from './sanitizer';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { MessengerModule } from '../messenger/messenger.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HeaderComponent } from './header/header.component';
import { PrivacyPolicyComponent } from './policies/privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './policies/terms-and-conditions/terms-and-conditions.component';
import { CookiesPolicyComponent } from './policies/cookies-policy/cookies-policy.component';
import { GetStartedComponent } from './get-started/get-started.component';
import { SearchPipe } from './help-center/help-center/search.pipe';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ThankYouComponent } from './thank-you/thank-you.component';
import { IframeComponent } from './iframe/iframe.component';

@NgModule({
  declarations: [
    RootComponent,
    AboutComponent,
    PricingComponent,
    ContactComponent,
    LoginComponent,
    HomeComponent,
    NavBarComponent,
    FooterComponent,
    SideNavComponent,
    RegisterComponent,
    EmailVerificationComponent,
    PageNotFoundComponent,
    SolutionsComponent,
    SanitizerPipe,
    SanitizerStyle,
    HeaderComponent,
    PrivacyPolicyComponent,
    TermsAndConditionsComponent,
    CookiesPolicyComponent,
    GetStartedComponent,
    SearchPipe,
    PasswordResetComponent,
    ForgotPasswordComponent,
    ThankYouComponent,
    IframeComponent,
  ],

  imports: [
    CommonModule,
    SplashRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    CardsModule,
    ExtendedModule,
    FlexLayoutModule,
    FontAwesomeModule,
    MaterialModule,
    MessengerModule,
  ],
  providers: [LoginGuard],
  exports: [NavBarComponent, HeaderComponent, SearchPipe, GetStartedComponent],
})
export class SplashModule {}
