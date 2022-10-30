import { TestBed } from '@angular/core/testing';

import { PaymentService } from './payment.service';
import { PaymentModule } from './payment.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('PaymentService', () => {
  let service: PaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PaymentModule, RouterTestingModule],
    });
    service = TestBed.inject(PaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
