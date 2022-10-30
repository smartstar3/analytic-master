import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SolutionsComponent } from './solutions.component';
import { SanitizerPipe, SanitizerStyle } from '../sanitizer';

describe('SolutionsComponent', () => {
  let component: SolutionsComponent;
  let fixture: ComponentFixture<SolutionsComponent>;

  beforeEach(
    waitForAsync(() => {
      void TestBed.configureTestingModule({
        declarations: [SolutionsComponent, SanitizerPipe, SanitizerStyle],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SolutionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
