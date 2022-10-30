import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChangeCompanyLinkDialogComponent } from './change-company-link-dialog.component';
import { DashboardModule } from '../../dashboard.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { CookieService } from 'ngx-cookie-service';
import { MaterialModule } from '../../material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('ChangeCompanyLinkDialogComponent', () => {
  let component: ChangeCompanyLinkDialogComponent;
  let fixture: ComponentFixture<ChangeCompanyLinkDialogComponent>;

  beforeEach(
    waitForAsync(() => {
      void TestBed.configureTestingModule({
        imports: [NoopAnimationsModule, MaterialModule, DashboardModule, RouterTestingModule],
        providers: [
          CookieService,
          {
            provide: MatDialogRef,
            useValue: {},
          },
          {
            provide: MAT_DIALOG_DATA,
            useValue: {},
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeCompanyLinkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
