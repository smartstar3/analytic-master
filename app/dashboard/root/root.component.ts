import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { MediaObserver } from '@angular/flex-layout';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
})
export class RootComponent {
  constructor(private auth: AuthService, public mo: MediaObserver) {}

  logout(): void {
    this.auth.logout();
  }

  mode(): 'over' | 'push' | 'side' {
    if (!this.mo.isActive('sm') && !this.mo.isActive('xs')) {
      return 'side';
    }
    return 'over';
  }
}
