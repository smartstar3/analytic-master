import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScalableImageComponent } from './scalable-image.component';

xdescribe('ScalableImageComponent', () => {
  let component: ScalableImageComponent;
  let fixture: ComponentFixture<ScalableImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScalableImageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScalableImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
