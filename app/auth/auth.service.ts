import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { Params, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Role } from '../api/user';
import { environment } from 'src/environments/environment';
import { MessengerService } from '../messenger/messenger.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  get redirectUrl(): string {
    return this._redirectUrl;
  }

  set redirectUrl(value: string) {
    this._redirectUrl = value;
  }

  readonly API_ADDR: string = environment.api_base + 'users/';
  readonly JWT_TOKEN: string = 'access_token';
  readonly REFRESH_TOKEN: string = 'refresh_token';

  // store the URL so we can redirect after logging in
  private _redirectUrl: string;

  constructor(
    private cookieService: CookieService,
    private msgr: MessengerService,
    private http: HttpClient,
    private router: Router
  ) {}

  public loggedIn(): Observable<boolean> {
    if (localStorage.getItem('loggedIn')) {
      const loggedIn = localStorage.getItem('loggedIn');
      return of<boolean>(JSON.parse(loggedIn));
    }
    return of(false);
  }

  public reAuthenticate(): Observable<TokensInfo> {
    const refreshToken: string = this.checkRefreshToken() ? this.getRefreshTokenInfo().token : '';

    return this.http
      .post<TokensInfo>(this.API_ADDR + 'auth', { token: refreshToken })
      .pipe(
        tap((body) => {
          this.setTokens(body.access_token, body.refresh_token);
        })
      );
  }

  private getRefreshTokenInfo(): RTInfo | null {
    if (this.checkRefreshToken()) {
      const stored: string = this.cookieService.get(this.REFRESH_TOKEN);
      return JSON.parse(stored, (key, value) => (key === 'exp' ? new Date(value) : (value as string))) as RTInfo;
    }
    return null;
  }

  public getAccessTokenInfo(): Observable<JWTInfo> {
    if (this.checkAccessToken()) {
      const stored: string = this.cookieService.get(this.JWT_TOKEN);
      const jwtInfo: JWTInfo = JSON.parse(stored, (key, value) =>
        key === 'exp' ? new Date(value) : (value as string)
      ) as JWTInfo;
      return of(jwtInfo);
    }
    return this.reAuthenticate().pipe(map((tokens) => tokens.access_token));
  }

  public getAccessTokenInfoSync(): JWTInfo {
    if (this.checkAccessToken()) {
      const stored: string = this.cookieService.get(this.JWT_TOKEN);
      return JSON.parse(stored) as JWTInfo;
    }
    return null;
  }

  public checkAccessToken(): boolean {
    return this.cookieService.check(this.JWT_TOKEN);
  }

  public checkRefreshToken(): boolean {
    return this.cookieService.check(this.REFRESH_TOKEN);
  }

  private clearTokens(): void {
    this.cookieService.delete(this.JWT_TOKEN);
    this.cookieService.delete(this.REFRESH_TOKEN);
  }

  public login(email: string, password: string, queryParams?: Params): void {
    this.http
      .post<TokensInfo>(this.API_ADDR + 'login', { email, password })
      .toPromise()
      .then((body) => {
        this.setTokens(body.access_token, body.refresh_token);
        localStorage.setItem('loggedIn', 'true');
        if (queryParams) return this.router.navigate(['/pay'], { queryParams });
        if (this.redirectUrl) return this.router.navigate([this.redirectUrl]);
        return this.router.navigate(['/dash']);
      })
      .catch(() => {
        this.msgr.error('Incorrect email or password');
      });
  }

  public logout(): void {
    const refreshToken: string = this.checkRefreshToken() ? this.getRefreshTokenInfo().token : '';
    this.clearTokens();
    this.http
      .post(this.API_ADDR + 'logout', { token: refreshToken })
      .toPromise()
      .finally(() => {
        localStorage.setItem('loggedIn', 'false');
        this.msgr.message('You have been logged out');
        void this.router.navigate(['/login']);
      });
  }

  private setTokens(jwtInfo: JWTInfo, rtInfo: RTInfo): void {
    if (!jwtInfo || !rtInfo) return;
    this.clearTokens();
    this.cookieService.set(this.JWT_TOKEN, JSON.stringify(jwtInfo), 30);
    this.cookieService.set(this.REFRESH_TOKEN, JSON.stringify(rtInfo), 30);
  }
}

export interface JWTInfo {
  company: string;
  email: string;
  userId: number;
  role: Role;
  exp: Date;
  token: string;
}

export interface RTInfo {
  email: string;
  exp: Date;
  token: string;
}

export interface TokensInfo {
  access_token: JWTInfo;
  refresh_token: RTInfo;
}
