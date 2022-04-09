import { Directive, Input, OnDestroy } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { Subject } from 'rxjs';

@Directive({
  selector: '[budgetelloBaseInput]',
})
export class BaseInputDirective
  implements OnDestroy, ControlValueAccessor, Validator
{
  @Input() id: string;
  @Input() label: string;
  @Input() type: string;
  @Input() required: boolean;
  @Input() isDisabled = false;
  @Input() isFloatingLabel = false;
  @Input() formControlName: string;
  @Input() formControl: FormControl = new FormControl('');
  @Input() placeholder: string;
  @Input() autofocus = false;

  destroy$ = new Subject();

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  validate(): ValidationErrors | null {
    if (this.formControl?.invalid) {
      return { invalid: true };
    } else {
      return null;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  registerOnValidatorChange?(fn: () => void): void {
    this.onValidationChange = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.formControl.disable();
    } else {
      this.formControl.enable();
    }
  }

  writeValue(obj: any): void {
    // todo causes max callstack error because i pass the form control as input
    // this.formControl.setValue(obj);
  }

  //region no-ops necessary for implementing ControlValueAccessor
  onChange = (value: string) => {
    // no-op
  };

  onTouched = () => {
    // no-op
  };

  onValidationChange: any = () => {
    // no-op
  };

  //endregion
}
