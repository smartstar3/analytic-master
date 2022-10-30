import { TestBed } from '@angular/core/testing';

import { PaymentGuard } from './payment.guard';
import { AuthService } from '../auth/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { PaymentModule } from './payment.module';

describe('PaymentGuard', () => {
  let guard: PaymentGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PaymentModule, RouterTestingModule],
      providers: [AuthService],
    });
    guard = TestBed.inject(PaymentGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
