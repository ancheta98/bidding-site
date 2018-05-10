import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {HelpComponent} from './help/help.component'
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { DashComponent } from './dash/dash.component';
import { BidComponent } from './bid/bid.component';

const routes: Routes = [
  // {path: '', component: RegistrationComponent},
  // {path: 'login', component: LoginComponent},
  {path: 'help', component: HelpComponent},
  {path: 'dash', component: DashComponent},
  {path: 'bid/:id', component: BidComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
