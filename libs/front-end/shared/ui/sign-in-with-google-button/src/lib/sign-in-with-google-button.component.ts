import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'budgetello-sign-in-with-google-button',
  templateUrl: './sign-in-with-google-button.component.html',
  styleUrls: ['./sign-in-with-google-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInWithGoogleButtonComponent {
  @Output() clicked = new EventEmitter();
}
