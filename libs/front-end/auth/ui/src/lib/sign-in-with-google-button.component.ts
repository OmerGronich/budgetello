import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { AuthFacade } from '@budgetello/front-end-shared-domain';
import { Router } from '@angular/router';
import { ToastService } from '@budgetello/front-end-shared-ui-toast';

@Component({
  selector: 'budgetello-sign-in-with-google-button',
  templateUrl: './sign-in-with-google-button.component.html',
  styleUrls: ['./sign-in-with-google-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInWithGoogleButtonComponent {
  constructor(
    private authFacade: AuthFacade,
    private router: Router,
    private toastService: ToastService
  ) {}

  async signInWithGoogle() {
    try {
      await this.authFacade.signInWithGoogle();
      this.router.navigateByUrl('/');
    } catch (error) {
      this.toastService.somethingWentWrongErrorMessage();
    }
  }
}
