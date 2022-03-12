import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { BaseReactiveFormDirective } from '../../directives/base-reactive-form.directive';
import firebase from 'firebase/compat';
import FirebaseError = firebase.FirebaseError;
import { ToastService } from '../../services/toast.service';

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
  usernamePasswordLoading = false;
  signInWithGoogleLoading = false;

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
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  signInWithGoogle($event: MouseEvent) {
    throw new Error('not implemented');
  }

  async onSignIn($event: SubmitEvent) {
    $event.preventDefault();

    const invalidControls = this.getInvalidFormControls(this.form);

    for (const control of invalidControls) {
      if (control.getError('required')) {
        control.markAsDirty();
      }

      if (control.getError('email')) {
        control.markAsDirty();
        this.toastService.invalidEmailErrorMessage();
      }

      if (control.getError('wrongPassword')) {
        control.markAsDirty();
        this.toastService.wrongPasswordErrorMessage();
      }
    }

    if (invalidControls.length) {
      return;
    }

    try {
      this.usernamePasswordLoading = true;
      await this.auth.signInWithEmailAndPassword(
        this.emailFormControl?.value,
        this.passwordFormControl?.value
      );
      this.router.navigateByUrl('/');
    } catch (error) {
      console.log({ e: error });
      this.handleFirebaseError(<FirebaseError>error);
    } finally {
      this.usernamePasswordLoading = false;
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
