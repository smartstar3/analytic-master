import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DescriptionInputComponent } from './description-input.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('DescriptionInput', () => {
  let component: DescriptionInputComponent;
  let fixture: ComponentFixture<DescriptionInputComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DescriptionInputComponent],
        imports: [RouterTestingModule],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptionInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
