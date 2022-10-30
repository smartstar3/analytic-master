import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StarAverageComponent } from './star-average.component';
import { SubmissionsModule } from '../../submissions.module';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('StarAverageComponent', () => {
  let component: StarAverageComponent;
  let fixture: ComponentFixture<StarAverageComponent>;

  beforeEach(
    waitForAsync(() => {
      void TestBed.configureTestingModule({
        imports: [SubmissionsModule, RouterTestingModule, NoopAnimationsModule],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(StarAverageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
