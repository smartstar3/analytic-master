import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { mergeMap, tap } from 'rxjs/operators';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.auth.loggedIn().pipe(
      mergeMap((loggedIn) => of(!loggedIn)),
      tap((loggedOut) => {
        const { plan } = route.queryParams;
        if (!loggedOut && !plan) {
          void this.router.navigate(['/dash']);
        } else if (!loggedOut) {
          void this.router.navigate(['/pay'], { queryParams: route.queryParams });
        }
      })
    );
  }
}
