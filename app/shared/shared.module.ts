import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlimComponent } from './components/slim/slim.component';

@NgModule({
  declarations: [SlimComponent],
  imports: [CommonModule],
  exports: [SlimComponent],
})
export class SharedModule {}
