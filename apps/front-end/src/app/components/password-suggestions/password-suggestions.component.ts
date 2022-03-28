import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

export interface PasswordSuggestion {
  text: string;
  answersSuggestion$: Observable<boolean>;
}

@Component({
  selector: 'budgetello-password-suggestions[suggestions]',
  templateUrl: './password-suggestions.component.html',
  styleUrls: ['./password-suggestions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordSuggestionsComponent {
  @Input() suggestions: PasswordSuggestion[];
}
