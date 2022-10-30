import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImageManagerComponent } from './image-manager.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MessengerModule } from '../../../messenger/messenger.module';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ImageManagerComponent', () => {
  let component: ImageManagerComponent;
  let fixture: ComponentFixture<ImageManagerComponent>;

  beforeEach(
    waitForAsync(() => {
      void TestBed.configureTestingModule({
        declarations: [ImageManagerComponent],
        imports: [HttpClientTestingModule, MessengerModule, RouterTestingModule, NoopAnimationsModule],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
