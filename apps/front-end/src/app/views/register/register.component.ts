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

@Component({
  selector: 'budgetello-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
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

  get email() {
    return this.form.get('email')?.value || '';
  }

  get password() {
    return this.form.get('password')?.value || '';
  }

  constructor(private fb: FormBuilder, private auth: AngularFireAuth) {}

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

  checkLowercase({ password }: { password: string }) {
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

  markInvalidFormControlsDirty() {
    Object.entries(this.form.controls).forEach(([, value]) => {
      if (value.invalid) {
        value.markAsDirty();
      }
    });
  }

  async onSubmit($event: SubmitEvent) {
    $event.preventDefault();
    this.markInvalidFormControlsDirty();
    if (!this.form.valid) {
      return;
    }

    try {
      await this.auth.createUserWithEmailAndPassword(this.email, this.password);
    } catch (e) {
      console.log({ e });
    } finally {
      this.form.reset();
    }
  }
}
