import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageManageDialogComponent } from './image-manage-dialog.component';

xdescribe('ImageManageDialogComponent', () => {
  let component: ImageManageDialogComponent;
  let fixture: ComponentFixture<ImageManageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageManageDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageManageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
