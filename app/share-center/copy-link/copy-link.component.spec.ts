import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyLinkComponent } from './copy-link.component';

xdescribe('CopyLinkComponent', () => {
  let component: CopyLinkComponent;
  let fixture: ComponentFixture<CopyLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CopyLinkComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
