import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RecalInformationComponent } from './recal-information.component';

describe('RecalInformationComponent', () => {
  let component: RecalInformationComponent;
  let fixture: ComponentFixture<RecalInformationComponent>;

  beforeEach(
    waitForAsync(() => {
      void TestBed.configureTestingModule({
        declarations: [RecalInformationComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(RecalInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
