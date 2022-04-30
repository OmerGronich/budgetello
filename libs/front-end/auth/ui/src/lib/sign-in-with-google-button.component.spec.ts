import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInWithGoogleButtonComponent } from './sign-in-with-google-button.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastService } from '@budgetello/front-end-shared-ui-toast';
import { MessageService } from 'primeng/api';
import { AuthFacade } from '@budgetello/front-end-shared-domain';

class AuthFacadeMock {
  signInWithGoogle = jest.fn();
}

describe('SignInWithGoogleButtonComponent', () => {
  let component: SignInWithGoogleButtonComponent;
  let fixture: ComponentFixture<SignInWithGoogleButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [SignInWithGoogleButtonComponent],
      providers: [
        ToastService,
        MessageService,
        { provide: AuthFacade, useClass: AuthFacadeMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInWithGoogleButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
