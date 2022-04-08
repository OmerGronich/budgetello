import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  Form,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { map, Observable, shareReplay } from 'rxjs';
import { mustMatchValidator } from '../../../validators/must-match.validator';
import { PasswordSuggestion } from '../../../components/password-suggestions/password-suggestions.component';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { BaseReactiveFormDirective } from '../../../directives/base-reactive-form.directive';
import { ToastService } from '../../../services/toast/toast.service';
import { STRONG_PASSWORD_PATTERN } from '../../../constants';
import { AuthenticationService } from '../../../services/authentication/authentication.service';

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
  form: FormGroup;
  hasLowerCase$: Observable<boolean>;
  hasUpperCase$: Observable<boolean>;
  hasNumber$: Observable<boolean>;
  hasMinimum$: Observable<boolean>;

  get passwordSuggestions(): PasswordSuggestion[] {
    return [
      {
        text: 'At least one lowercase letter',
        answersSuggestion$: this.hasLowerCase$,
      },
      {
        text: 'At least one uppercase letter',
        answersSuggestion$: this.hasUpperCase$,
      },
      {
        text: 'At least one number',
        answersSuggestion$: this.hasNumber$,
      },
      {
        text: 'At least 8 characters long',
        answersSuggestion$: this.hasMinimum$,
      },
    ];
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
    public authenticationService: AuthenticationService
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
    this.hasLowerCase$ = this.form.valueChanges.pipe(
      shareReplay(1),
      map(this.checkLowercase)
    );
    this.hasUpperCase$ = this.form.valueChanges.pipe(
      shareReplay(1),
      map(this.checkUppercase)
    );
    this.hasNumber$ = this.form.valueChanges.pipe(
      shareReplay(1),
      map(this.checkNumber)
    );
    this.hasMinimum$ = this.form.valueChanges.pipe(
      shareReplay(1),
      map(this.hasMinimum(8))
    );
  }

  private checkLowercase({ password }: { password: string }) {
    return password.toUpperCase() !== password;
  }

  private checkUppercase({ password }: { password: string }) {
    return password.toLowerCase() !== password;
  }

  private checkNumber({ password }: { password: string }) {
    return /\d/.test(password);
  }

  private hasMinimum(minimum: number) {
    return ({ password }: { password: string }) => password.length >= minimum;
  }
  async onRegister($event: SubmitEvent) {
    $event.preventDefault();

    this.markInvalidControlsAsDirty(this.form);

    this.handlePasswordsDoNotMatchError();
    this.handleEmailAlreadyInUseError();

    if (!this.form.valid) {
      return;
    }

    const { error } =
      await this.authenticationService.createUserWithEmailAndPassword(
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
}
