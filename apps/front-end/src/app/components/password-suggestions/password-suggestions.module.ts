import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PasswordSuggestionsComponent} from "./password-suggestions.component";



@NgModule({
  declarations: [PasswordSuggestionsComponent],
  imports: [
    CommonModule
  ],
  exports: [PasswordSuggestionsComponent]
})
export class PasswordSuggestionsModule { }
