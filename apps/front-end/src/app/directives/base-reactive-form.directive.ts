import { Directive } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Directive({
  selector: '[budgetelloBaseReactiveForm]',
})
export class BaseReactiveFormDirective {
  protected getInvalidFormControls(form: FormGroup) {
    return Object.values(form.controls).filter((value) => value.invalid);
  }

  protected markInvalidControlsAsDirty(form: FormGroup) {
    const invalidControls = this.getInvalidFormControls(form);
    invalidControls.forEach((control) => control.markAsDirty());
  }
}
