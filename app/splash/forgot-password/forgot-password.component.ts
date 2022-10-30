import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../api/api.service';
import { MessengerService } from '../../messenger/messenger.service';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  email = new FormControl('', [Validators.email, Validators.required]);

  constructor(private router: Router, private api: ApiService, private msgr: MessengerService) {}

  sendEmail(): void {
    if (!this.email.valid) return;
    this.api.sendResetPasswordEmail(this.email.value).subscribe(
      () => {
        this.msgr.message('email sent successfully!');
      },
      () => {
        this.msgr.error(`Unable to send email!`);
      }
    );
  }
}
