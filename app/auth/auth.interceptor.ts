import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { AuthService, TokensInfo } from './auth.service';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(private auth: AuthService) {}

  intercept<T>(req: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {
    // should log requests when not in production
    if (!environment.production) {
      console.log('the request is', req);
    }

    // should ignore authentication requests
    if (req.url.includes('login') || req.url.includes('logout') || req.url.includes('register')) {
      return next.handle(req);
    }

    // should logout if the refresh token is invalid
    if (req.url.includes('auth')) {
      return next.handle(req).pipe(
        catchError((err) => {
          this.isRefreshing = false;
          this.auth.logout();
          return throwError(err);
        })
      );
    }

    if (this.auth.checkAccessToken()) {
      req = this.applyHeaders(req, this.auth.getAccessTokenInfoSync().token);
    }

    return next.handle(req).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(req, next);
        } else {
          return throwError(error);
        }
      })
    );
  }

  private handle401Error<T>(req: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.auth.reAuthenticate().pipe(
        switchMap((body: TokensInfo) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(body.access_token.token);
          return next.handle(this.applyHeaders(req, body.access_token.token));
        })
      );
    }

    return this.refreshTokenSubject.pipe(
      filter((token) => token != null),
      take(1),
      switchMap((jwt) => {
        return next.handle(this.applyHeaders(req, jwt));
      })
    );
  }

  applyHeaders<T>(req: HttpRequest<T>, jwtToken: string): HttpRequest<T> {
    return req.clone({
      headers: req.headers.set('Authorization', `Bearer ${jwtToken}`),
    });
  }
}
