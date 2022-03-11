import { TestBed } from '@angular/core/testing';

import { AuthenticationStore } from './authentication.store';

describe('AuthenticationService', () => {
  let service: AuthenticationStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthenticationStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
