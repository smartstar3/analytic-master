import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PaymentCompletedDialogComponent } from './payment-completed-dialog.component';
import { DashboardModule } from '../../dashboard.module';
import { MatDialogRef } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('PaymentCompletedDialogComponent', () => {
  let component: PaymentCompletedDialogComponent;
  let fixture: ComponentFixture<PaymentCompletedDialogComponent>;

  beforeEach(
    waitForAsync(() => {
      void TestBed.configureTestingModule({
        imports: [DashboardModule, RouterTestingModule, NoopAnimationsModule],
        providers: [{ provide: MatDialogRef, useValue: {} }],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentCompletedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
