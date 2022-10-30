import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

// eslint-disable-next-line @typescript-eslint/ban-types
declare let gtag: Function;

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent {
  constructor(public router: Router) {
    const navEndEvents = this.router.events.pipe(filter((event) => event instanceof NavigationEnd));
    navEndEvents.subscribe((event: NavigationEnd) => {
      gtag('config', 'UA-169405571-1', {
        page_path: event.urlAfterRedirects,
      });
    });
  }
}
