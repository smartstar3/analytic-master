import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MyFirstFormComponent } from './my-first-form.component';

describe('GettingStartedComponent', () => {
  let component: MyFirstFormComponent;
  let fixture: ComponentFixture<MyFirstFormComponent>;

  beforeEach(
    waitForAsync(() => {
      void TestBed.configureTestingModule({
        declarations: [MyFirstFormComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MyFirstFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
