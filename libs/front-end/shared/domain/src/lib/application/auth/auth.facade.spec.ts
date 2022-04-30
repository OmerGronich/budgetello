import { TestBed } from '@angular/core/testing';

import { AuthFacade } from './auth.facade';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { of } from 'rxjs';

class AngularFireAuthMock {
  signInWithPopup = jest.fn();
  signInWithEmailAndPassword = jest.fn();
  createUserWithEmailAndPassword = jest.fn();
  signOut = jest.fn();
  user = of({});
}

describe('AuthServiceService', () => {
  let service: AuthFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: AngularFireAuth, useClass: AngularFireAuthMock }],
    });
    service = TestBed.inject(AuthFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
