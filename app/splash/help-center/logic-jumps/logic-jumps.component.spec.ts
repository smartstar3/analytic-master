import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LogicJumpsComponent } from './logic-jumps.component';

describe('LogicJumpsComponent', () => {
  let component: LogicJumpsComponent;
  let fixture: ComponentFixture<LogicJumpsComponent>;

  beforeEach(
    waitForAsync(() => {
      void TestBed.configureTestingModule({
        declarations: [LogicJumpsComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LogicJumpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
