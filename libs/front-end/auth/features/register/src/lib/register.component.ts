import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { BaseReactiveFormDirective } from '@budgetello/front-end/shared/ui/base-reactive-form';
import { ToastService } from '@budgetello/front-end-shared-ui-toast';
import {
  AuthFacade,
  STRONG_PASSWORD_PATTERN,
} from '@budgetello/front-end-shared-domain';
import { mustMatchValidator } from '@budgetello/front-end/shared/utils/validators/must-match';

@Component({
  selector: 'budgetello-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent
  extends BaseReactiveFormDirective
  implements OnInit
{
  @HostBinding('class') class = 'login-register-pages';

  form: FormGroup;

  get usernamePasswordLoading(): boolean {
    return this.authFacade.usernamePasswordLoading;
  }

  get passwordsDoNotMatchError() {
    return this.form.errors && this.form.errors['passwordsDoNotMatch'];
  }

  get nameFormControl() {
    return this.form.get('name') as FormControl;
  }

  get emailFormControl() {
    return this.form.get('email') as FormControl;
  }

  get passwordFormControl() {
    return this.form.get('password') as FormControl;
  }

  get verifyPasswordFormControl() {
    return this.form.get('verify') as FormControl;
  }

  get email() {
    return this.form.get('email')?.value || '';
  }

  get password() {
    return this.form.get('password')?.value || '';
  }

  get isEmailAlreadyInUse() {
    return (
      this.form.get('email')?.errors &&
      this.form.get('email')?.getError('emailAlreadyInUse')
    );
  }

  constructor(
    private fb: FormBuilder,
    private auth: AngularFireAuth,
    private toastService: ToastService,
    private router: Router,
    private authFacade: AuthFacade
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [
          Validators.required,
          Validators.pattern(STRONG_PASSWORD_PATTERN),
        ]),
        verify: new FormControl('', [Validators.required]),
        name: new FormControl(''),
      },
      { validators: mustMatchValidator }
    );
  }

  async onRegister($event: SubmitEvent) {
    $event.preventDefault();

    this.markInvalidControlsAsDirty(this.form);

    this.handlePasswordsDoNotMatchError();
    this.handleEmailAlreadyInUseError();

    if (!this.form.valid) {
      return;
    }

    const { error } = await this.authFacade.createUserWithEmailAndPassword(
      this.email,
      this.password,
      { displayName: this.form.get('name')?.value || '' }
    );

    if (error) {
      this.form.controls['email'].setErrors({
        emailAlreadyInUse: error.code === 'auth/email-already-in-use',
      });
      this.handleEmailAlreadyInUseError();
    } else {
      this.form.reset();
      this.router.navigateByUrl('/');
    }
  }

  handleEmailAlreadyInUseError() {
    if (this.isEmailAlreadyInUse) {
      this.toastService.emailAlreadyInUseMessage();
    }
  }

  handlePasswordsDoNotMatchError() {
    if (this.passwordsDoNotMatchError) {
      this.toastService.passwordsDoNotMatchMessage();
    }
  }

  // todo refactor duplicate code
  async signInWithGoogle() {
    try {
      await this.authFacade.signInWithGoogle();
      this.router.navigateByUrl('/');
    } catch (error) {
      this.toastService.somethingWentWrongErrorMessage();
    }
  }
}
