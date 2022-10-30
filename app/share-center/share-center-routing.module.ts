import { RouterModule, Routes } from '@angular/router';
import { RootComponent } from './root/root.component';
import { NgModule } from '@angular/core';

const routes: Routes = [{ path: ':fid', component: RootComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShareCenterRoutingModule {}
