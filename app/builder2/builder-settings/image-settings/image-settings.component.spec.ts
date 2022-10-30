import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageSettingsComponent } from './image-settings.component';

xdescribe('ImageSettingsComponent', () => {
  let component: ImageSettingsComponent;
  let fixture: ComponentFixture<ImageSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
