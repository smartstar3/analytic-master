import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class PaymentGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.auth.loggedIn().pipe(
      tap((loggedIn) => {
        const { plan } = next.queryParams;
        if (!state.url.includes('success')) {
          if (loggedIn && !plan) void this.router.navigate(['/dash']);
        }
      })
    );
  }
}
