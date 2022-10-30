import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HowToCreateAAccountComponent } from './how-to-create-a-account.component';

describe('HowToCreateAAccountComponent', () => {
  let component: HowToCreateAAccountComponent;
  let fixture: ComponentFixture<HowToCreateAAccountComponent>;

  beforeEach(
    waitForAsync(() => {
      void TestBed.configureTestingModule({
        declarations: [HowToCreateAAccountComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(HowToCreateAAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
