import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseInputDirective } from '@budgetello/front-end-shared-ui-base-input';

@Component({
  selector: 'budgetello-password-input',
  templateUrl: './password-input.component.html',
  styleUrls: ['./password-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: PasswordInputComponent,
      multi: true,
    },
  ],
})
export class PasswordInputComponent extends BaseInputDirective {
  @Input() feedBack = true;
  @Input() toggleMask = true;
}
