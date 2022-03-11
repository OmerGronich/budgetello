import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register.component';
import {InputTextModule} from "primeng/inputtext";
import {PasswordModule} from "primeng/password";
import {ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {DividerModule} from "primeng/divider";

@NgModule({
  declarations: [
    RegisterComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    InputTextModule,
    PasswordModule,
    ReactiveFormsModule,
    ButtonModule,
    RippleModule,
    DividerModule,
  ]
})
export class RegisterModule { }
