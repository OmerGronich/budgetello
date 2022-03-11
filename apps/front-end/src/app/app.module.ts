import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {RouterModule} from "@angular/router";
import {LayoutModule} from "./components/layout/layout.module";
import {LoginModule} from "./views/login/login.module";
import {HomeModule} from "./views/home/home.module";
import {RegisterModule} from "./views/register/register.module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, RouterModule, LayoutModule, LoginModule, HomeModule, RegisterModule, BrowserAnimationsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
