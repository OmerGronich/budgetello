import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export const mustMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null =>  {
  const pass = group.get('password')?.value;
  const confirmPass = group.get('verify')?.value;
  return pass === confirmPass ? null : { passwordsDoNotMatch: true };
}
