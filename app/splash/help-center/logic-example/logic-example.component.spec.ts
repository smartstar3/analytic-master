import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LogicExampleComponent } from './logic-example.component';

describe('LogicExampleComponent', () => {
  let component: LogicExampleComponent;
  let fixture: ComponentFixture<LogicExampleComponent>;

  beforeEach(
    waitForAsync(() => {
      void TestBed.configureTestingModule({
        declarations: [LogicExampleComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LogicExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
