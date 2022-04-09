import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordSuggestionsComponent } from './password-suggestions.component';
import { ValidateSuggestionPipe } from './validate-suggestion.pipe';

@NgModule({
  declarations: [PasswordSuggestionsComponent, ValidateSuggestionPipe],
  exports: [PasswordSuggestionsComponent, ValidateSuggestionPipe],
  imports: [CommonModule],
})
export class PasswordSuggestionsModule {}
