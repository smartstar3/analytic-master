import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionChoiceComponent } from './question-choice.component';

xdescribe('QuestionChoiceComponent', () => {
  let component: QuestionChoiceComponent;
  let fixture: ComponentFixture<QuestionChoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuestionChoiceComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
