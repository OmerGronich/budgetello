import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { map, Observable, shareReplay } from 'rxjs';
import { mustMatchValidator } from '../../validators/must-match.validator';
import { PasswordSuggestion } from '../../components/password-suggestions/password-suggestions.component';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat';
import { GoogleAuthProvider } from 'firebase/auth';
import { Router } from '@angular/router';
import { BaseReactiveFormDirective } from '../../directives/base-reactive-form.directive';
import { ToastService } from '../../services/toast.service';
import FirebaseError = firebase.FirebaseError;

@Component({
  selector: 'budgetello-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
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
  usernamePasswordLoading: boolean;
  signInWithGoogleLoading: boolean;

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
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [
          Validators.required,
          Validators.pattern(
            /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})./
          ),
        ]),
        verify: new FormControl('', [Validators.required]),
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

    const invalidControls = this.getInvalidFormControls(this.form);

    for (const invalidControl of invalidControls) {
      invalidControl.markAsDirty();
    }

    this.handlePasswordsDoNotMatchError();
    this.handleEmailAlreadyInUseError();

    if (!this.form.valid) {
      return;
    }

    try {
      this.usernamePasswordLoading = true;
      await this.auth.createUserWithEmailAndPassword(this.email, this.password);
      this.form.reset();
      this.router.navigateByUrl('/');
    } catch (error) {
      this.form.controls['email'].setErrors({
        emailAlreadyInUse:
          (<FirebaseError>error).code === 'auth/email-already-in-use',
      });
      this.handleEmailAlreadyInUseError();
    } finally {
      this.usernamePasswordLoading = false;
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

  async signInWithGoogle(_: MouseEvent) {
    try {
      this.signInWithGoogleLoading = true;
      await this.auth.signInWithPopup(new GoogleAuthProvider());
      this.router.navigateByUrl('/');
    } catch (error) {
      console.log({ error });
    } finally {
      this.signInWithGoogleLoading = false;
    }
  }
}
