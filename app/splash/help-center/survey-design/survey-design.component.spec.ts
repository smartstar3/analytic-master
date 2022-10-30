import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SurveyDesignComponent } from './survey-design.component';

describe('SurveyDesignComponent', () => {
  let component: SurveyDesignComponent;
  let fixture: ComponentFixture<SurveyDesignComponent>;

  beforeEach(
    waitForAsync(() => {
      void TestBed.configureTestingModule({
        declarations: [SurveyDesignComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
