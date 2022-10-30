import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
    persistent: [false],
  });
  register = 'register';
  forgot = 'forgot';
  queryParams: Params;

  constructor(private auth: AuthService, private fb: FormBuilder, private route: ActivatedRoute) {
    this.queryParams = route.snapshot.queryParams;
  }

  login(email: string, password: string): void {
    const { plan } = this.queryParams;
    if (!plan) return this.auth.login(email, password);
    this.auth.login(email, password, this.queryParams);
  }
}
