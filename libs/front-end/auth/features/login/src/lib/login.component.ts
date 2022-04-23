import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  OnInit,
} from '@angular/core';
import { BaseReactiveFormDirective } from '@budgetello/front-end/shared/ui/base-reactive-form';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '@budgetello/front-end-shared-ui-toast';
import { AuthFacade } from '@budgetello/front-end-shared-domain';
import firebase from 'firebase/compat';
import FirebaseError = firebase.FirebaseError;

@Component({
  selector: 'budgetello-login-feature',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent
  extends BaseReactiveFormDirective
  implements OnInit
{
  @HostBinding('class') class = 'login-register-pages';

  form: FormGroup;

  get usernamePasswordLoading(): boolean {
    return this.authFacade.usernamePasswordLoading;
  }

  get emailFormControl() {
    return this.form.get('email') as FormControl;
  }

  get passwordFormControl() {
    return this.form.get('password') as FormControl;
  }

  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private router: Router,
    private authFacade: AuthFacade
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

    const { error } = await this.authFacade.signInWithEmailAndPassword(
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
