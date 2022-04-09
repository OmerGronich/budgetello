import { Pipe, PipeTransform } from '@angular/core';
import { PasswordSuggestion } from './password-suggestions.component';

@Pipe({
  name: 'validateSuggestion',
})
export class ValidateSuggestionPipe implements PipeTransform {
  transform(value: {
    suggestion: PasswordSuggestion;
    password: string;
  }): boolean {
    const validator = {
      lowercase: this.checkLowercase.bind(this),
      uppercase: this.checkUppercase.bind(this),
      number: this.checkNumber.bind(this),
      minimum: this.hasMinimum.bind(this)(8),
    }[value.suggestion.id];

    return validator(value.password);
  }

  private checkLowercase(password: string) {
    return password.toUpperCase() !== password;
  }

  private checkUppercase(password: string) {
    return password.toLowerCase() !== password;
  }

  private checkNumber(password: string) {
    return /\d/.test(password);
  }

  private hasMinimum(minimum: number) {
    return (password: string) => password.length >= minimum;
  }
}
