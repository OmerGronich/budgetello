import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export interface PasswordSuggestion {
  text: string;
  id: 'lowercase' | 'uppercase' | 'number' | 'minimum';
}

@Component({
  selector: 'budgetello-password-suggestions',
  templateUrl: './password-suggestions.component.html',
  styleUrls: ['./password-suggestions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordSuggestionsComponent {
  @Input() currentPassword: string;

  suggestions: PasswordSuggestion[] = [
    {
      text: 'At least one lowercase letter',
      id: 'lowercase',
    },
    {
      text: 'At least one uppercase letter',
      id: 'uppercase',
    },
    {
      text: 'At least one number',
      id: 'number',
    },
    {
      text: 'At least 8 characters long',
      id: 'minimum',
    },
  ];
}
