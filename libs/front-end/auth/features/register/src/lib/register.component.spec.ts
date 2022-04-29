import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastService } from '@budgetello/front-end-shared-ui-toast';
import { AuthFacade } from '@budgetello/front-end-shared-domain';
import { RegisterModule } from './register.module';
import { MessageService } from 'primeng/api';

class AngularFireAuthMock {}
class ToastServiceMock {}
class AuthFacadeMock {}

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterModule, RouterTestingModule],
      declarations: [RegisterComponent],
      providers: [
        { provide: AngularFireAuth, useClass: AngularFireAuthMock },
        { provide: ToastService, useClass: ToastServiceMock },
        { provide: AuthFacade, useClass: AuthFacadeMock },
        MessageService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
