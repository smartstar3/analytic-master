import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EndScreenComponent } from './end-screen.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { BuilderModule } from '../../builder.module';
import { InitService } from '../../services/init.service';
import { EndService } from '../../services/end.service';
import { IdService } from '../../services/id.service';
import { ApiService } from '../../../api/api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EndScreenComponent', () => {
  let component: EndScreenComponent;
  let fixture: ComponentFixture<EndScreenComponent>;

  beforeEach(
    waitForAsync(() => {
      void TestBed.configureTestingModule({
        declarations: [],
        imports: [NoopAnimationsModule, BuilderModule, RouterTestingModule, HttpClientTestingModule],
        providers: [InitService, EndService, IdService, ApiService],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EndScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
