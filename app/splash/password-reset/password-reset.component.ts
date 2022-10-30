import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiService } from '../../api/api.service';
import { MessengerService } from '../../messenger/messenger.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
})
export class PasswordResetComponent implements OnInit {
  // email is here so that validations for `confirm password` are triggered when password managers that autofill passwords (like lastpass) are used
  email = new FormControl('', [Validators.email, Validators.required]);
  queryParams: Params;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private msgr: MessengerService
  ) {
    this.queryParams = route.snapshot.queryParams;
  }

  ngOnInit(): void {
    const { email, hash } = this.queryParams;
    if (!email || !hash) void this.router.navigate(['/login']);
  }

  reset(password: string): void {
    const { email, hash } = this.queryParams;

    this.api.resetPassword(password, email, hash).subscribe(
      () => {
        this.msgr.message('Your password was reset successfully!');
        void this.router.navigate(['/login']);
      },
      () => {
        this.msgr.error(`password reset error`);
      }
    );
  }
}
