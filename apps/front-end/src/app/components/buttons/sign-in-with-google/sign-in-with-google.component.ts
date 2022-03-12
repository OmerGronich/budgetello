import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'budgetello-sign-in-with-google',
  templateUrl: './sign-in-with-google.component.html',
  styleUrls: ['./sign-in-with-google.component.scss'],
})
export class SignInWithGoogleComponent {
  @Output() clicked = new EventEmitter();
}
