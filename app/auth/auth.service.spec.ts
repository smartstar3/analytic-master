import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { CookieService } from 'ngx-cookie-service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthGuard } from './auth.guard';
import { Router, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { MessengerModule } from '../messenger/messenger.module';

describe('AuthService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule, MessengerModule],
      providers: [CookieService],
    })
  );

  it('should be created', () => {
    const service: AuthService = TestBed.inject(AuthService);
    expect(service).toBeTruthy();
  });
});

describe('AuthGuard', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule, MessengerModule],
      providers: [CookieService],
    })
  );

  it('should be created', () => {
    const guard: AuthGuard = TestBed.inject(AuthGuard);
    expect(guard).toBeTruthy();
  });

  it('should activate if logged in', () => {
    const router: Router = TestBed.inject(Router);
    const auth: AuthService = TestBed.inject(AuthService);
    spyOn(auth, 'loggedIn').and.returnValue(of(true));
    spyOn(router, 'navigate').and.callFake(() => of(true).toPromise());
    const guard: AuthGuard = new AuthGuard(auth, router);

    guard.canActivate(null, {} as RouterStateSnapshot).subscribe((next) => expect(next).toBe(true));
  });

  it('should not activate if logged out', () => {
    const router: Router = TestBed.inject(Router);
    const auth: AuthService = TestBed.inject(AuthService);
    spyOn(auth, 'loggedIn').and.returnValue(of(false));
    spyOn(router, 'navigate').and.callFake(() => of(true).toPromise());
    const guard: AuthGuard = new AuthGuard(auth, router);

    guard.canActivate(null, {} as RouterStateSnapshot).subscribe((next) => expect(next).toBe(false));
  });
});
