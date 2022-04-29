import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthFacade } from '@budgetello/front-end-shared-domain';
import { ToastService } from '@budgetello/front-end-shared-ui-toast';
import { LoginModule } from './login.module';
import { MessageService } from 'primeng/api';

class AuthFacadeMock {}
class ToastServiceMock {}

describe('LoginFeatureComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginModule, RouterTestingModule],
      declarations: [LoginComponent],
      providers: [
        { provide: AuthFacade, useClass: AuthFacadeMock },
        { provide: ToastService, useClass: ToastServiceMock },
        MessageService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
