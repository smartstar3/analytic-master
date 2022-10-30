import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ApiService } from '../../api/api.service';
import { MessengerService } from '../../messenger/messenger.service';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
  queryParams: Params;
  email = new FormControl('', [Validators.email, Validators.required]);
  login = 'login';

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private msgr: MessengerService,
    private auth: AuthService
  ) {
    this.queryParams = route.snapshot.queryParams;
  }

  register(email: string, password: string): void {
    this.api.register(email, password).subscribe(
      () => {
        this.createSubscription(email, password);
      },
      (err: HttpErrorResponse) => {
        this.msgr.error(`[${err.status}: ${err.statusText}] ${JSON.stringify(err.error)}`);
      }
    );
  }

  createSubscription(email: string, password: string): void {
    const { plan } = this.queryParams;
    if (!plan) return this.auth.login(email, password);
    this.auth.login(email, password, this.queryParams);
  }
}
