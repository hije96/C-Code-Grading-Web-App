import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';

import { HttpModule } from '@angular/http';
import { DetailComponent } from './detail/detail.component';
import { SubmitComponent } from './submit/submit.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminMainComponent } from './admin-main/admin-main.component';
import { AdminAddComponent } from './admin-add/admin-add.component';
import { AdminDetailComponent } from './admin-detail/admin-detail.component';
import { ChangepwComponent } from './changepw/changepw.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    DetailComponent,
    SubmitComponent,
    AdminLoginComponent,
    AdminMainComponent,
    AdminAddComponent,
    AdminDetailComponent,
    ChangepwComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
