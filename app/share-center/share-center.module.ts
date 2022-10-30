import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexModule } from '@angular/flex-layout';
import { QuillModule } from 'ngx-quill';
import { ShareCenterRoutingModule } from './share-center-routing.module';
import { MaterialModule } from './material.module';
import { RootComponent } from './root/root.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';
import { SelectFieldDialogComponent } from './components/select-field-dialog/select-field-dialog.component';
import { CopyLinkComponent } from './copy-link/copy-link.component';
import { EmailLinkComponent } from './email-link/email-link.component';
import { EmailStatusComponent } from './email-status/email-status.component';
import { PercentageBarComponent } from './components/percentage-bar/percentage-bar.component';
import { EmailStatusSerializerPipe } from './pipes/email-status-serializer.pipe';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EmailSendingDialogComponent } from './email-link/email-bulking-dialog/email-sending-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    RootComponent,
    SelectFieldDialogComponent,
    CopyLinkComponent,
    EmailLinkComponent,
    EmailStatusComponent,
    PercentageBarComponent,
    EmailStatusSerializerPipe,
    EmailSendingDialogComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    QuillModule.forRoot(),
    ColorPickerModule,
    ShareCenterRoutingModule,
    MaterialModule,
    FlexModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule,
    MatProgressSpinnerModule,
    DragDropModule
  ],
})
export class ShareCenterModule {}
