import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StartScreenComponent } from './start-screen.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { BuilderModule } from '../../builder.module';
import { InitService } from '../../services/init.service';
import { StartService } from '../../services/start.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IdService } from '../../services/id.service';
import { ApiService } from '../../../api/api.service';

describe('StartScreenComponent', () => {
  let component: StartScreenComponent;
  let fixture: ComponentFixture<StartScreenComponent>;

  beforeEach(
    waitForAsync(() => {
      void TestBed.configureTestingModule({
        declarations: [],
        imports: [NoopAnimationsModule, BuilderModule, RouterTestingModule, HttpClientTestingModule],
        providers: [InitService, StartService, IdService, ApiService],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(StartScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
