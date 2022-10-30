import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailSendingDialogComponent } from './email-sending-dialog.component';
import { ShareCenterModule } from '../../share-center.module';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MessengerModule } from '../../../messenger/messenger.module';
import { CookieService } from 'ngx-cookie-service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('EmailBulkingDialogComponent', () => {
  let component: EmailSendingDialogComponent;
  let fixture: ComponentFixture<EmailSendingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShareCenterModule, MessengerModule, HttpClientModule, RouterTestingModule],
      declarations: [ EmailSendingDialogComponent ],
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
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailSendingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
