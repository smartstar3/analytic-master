import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { AuthInterceptor } from './auth/auth.interceptor';
import { FlexModule } from '@angular/flex-layout';
import { MessengerModule } from './messenger/messenger.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PaymentGuard } from './payment/payment.guard';
import { GoogleAnalyticsService } from './google-analytics.service';

@NgModule({
  imports: [
    BrowserModule,
    MDBBootstrapModule.forRoot(),
    FlexModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MessengerModule,
    AppRoutingModule,
  ],
  declarations: [AppComponent],
  exports: [BrowserModule],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    PaymentGuard,
    GoogleAnalyticsService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
