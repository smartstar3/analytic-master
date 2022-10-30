import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnsweringRoutingModule } from './answering-routing.module';
import { RootComponent } from './root/root.component';
import { FormComponent } from './form/form.component';
import { FormModule } from '../form/form.module';
import { MaterialModule } from './material.module';
import { MessengerModule } from '../messenger/messenger.module';
import { GetPipe } from './form/get.pipe';
import { StartScreenComponent } from './start-screen/start-screen.component';
import { EndScreenComponent } from './end-screen/end-screen.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [RootComponent, FormComponent, GetPipe, StartScreenComponent, EndScreenComponent],
  imports: [CommonModule, AnsweringRoutingModule, FormModule, MaterialModule, MessengerModule, MatDialogModule],
  exports: [FormComponent],
})
export class AnsweringModule {}
