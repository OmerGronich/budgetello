import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { BaseReactiveFormDirective } from '../../directives/base-reactive-form.directive';
import firebase from 'firebase/compat';
import { ToastService } from '../../services/toast/toast.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import FirebaseError = firebase.FirebaseError;

@Component({
  selector: 'budgetello-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent
  extends BaseReactiveFormDirective
  implements OnInit
{
  form: FormGroup;

  get emailFormControl() {
    return this.form.get('email');
  }

  get passwordFormControl() {
    return this.form.get('password');
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
    this.form = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  async onSignIn($event: SubmitEvent) {
    $event.preventDefault();

    const invalidControls = this.getInvalidFormControls(this.form);

    for (const control of invalidControls) {
      if (control.errors) {
        control.markAsDirty();

        if (control.getError('email')) {
          this.toastService.invalidEmailErrorMessage();
        }

        if (control.getError('wrongPassword')) {
          this.toastService.wrongPasswordErrorMessage();
        }
      }
    }

    if (invalidControls.length) {
      return;
    }

    const { error } =
      await this.authenticationService.signInWithEmailAndPassword(
        this.emailFormControl?.value,
        this.passwordFormControl?.value
      );

    if (error) {
      this.handleFirebaseError(error);
    } else {
      this.form.reset();
      this.router.navigateByUrl('/');
    }
  }

  handleFirebaseError(error: FirebaseError) {
    switch (error.code) {
      case 'auth/user-not-found':
        this.toastService.userNotFoundErrorMessage();
        break;
      case 'auth/wrong-password':
        this.passwordFormControl?.setErrors({ wrongPassword: true });
        this.toastService.wrongPasswordErrorMessage();
        break;
      default:
        this.toastService.somethingWentWrongErrorMessage();
    }
  }
}
