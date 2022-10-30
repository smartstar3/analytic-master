import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DescriptionInputPartComponent } from './description-input-part.component';

describe('DescriptionInput', () => {
  let fixture: ComponentFixture<DescriptionInputPartComponent>;

  beforeEach(
    waitForAsync(() => {
      void TestBed.configureTestingModule({
        declarations: [DescriptionInputPartComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptionInputPartComponent);
    fixture.detectChanges();
  });
});
