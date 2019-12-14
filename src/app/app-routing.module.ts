import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {MainComponent} from './main/main.component';
import {DetailComponent} from './detail/detail.component';
import {SubmitComponent} from './submit/submit.component';
import {ChangepwComponent} from './changepw/changepw.component';

import {AdminLoginComponent} from './admin-login/admin-login.component';
import {AdminMainComponent} from './admin-main/admin-main.component';
import {AdminAddComponent} from './admin-add/admin-add.component';
import {AdminDetailComponent} from './admin-detail/admin-detail.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, },
  { path: 'main', component: MainComponent, },
  { path: 'changepw', component: ChangepwComponent, },
  { path: 'detail/:id', component: DetailComponent },
  { path: 'submit/:id', component: SubmitComponent },

  { path: 'admin/login', component: AdminLoginComponent, },
  { path: 'admin/main', component: AdminMainComponent, },
  { path: 'admin/detail/:id', component: AdminDetailComponent },
  { path: 'admin/add', component: AdminAddComponent },
  { path: 'admin', redirectTo: 'admin/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
