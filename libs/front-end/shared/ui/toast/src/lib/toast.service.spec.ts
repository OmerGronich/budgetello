import { TestBed } from '@angular/core/testing';

import { ToastService } from './toast.service';
import { MessageService } from 'primeng/api';

class MessageServiceMock {
  add = jest.fn();
}

describe('ErrorHandlingService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: MessageService, useClass: MessageServiceMock }],
    });
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
