import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PricingComponent } from './pricing.component';
import { SplashModule } from '../splash.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('PricingComponent', () => {
  let component: PricingComponent;
  let fixture: ComponentFixture<PricingComponent>;

  beforeEach(
    waitForAsync(() => {
      void TestBed.configureTestingModule({
        imports: [NoopAnimationsModule, SplashModule, RouterTestingModule],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
