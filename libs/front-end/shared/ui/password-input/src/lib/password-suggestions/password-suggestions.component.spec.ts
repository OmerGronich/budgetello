import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordSuggestionsComponent } from './password-suggestions.component';
import { PasswordSuggestionsModule } from './password-suggestions.module';

describe('PasswordSuggestionsComponent', () => {
  let component: PasswordSuggestionsComponent;
  let fixture: ComponentFixture<PasswordSuggestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordSuggestionsModule],
      declarations: [PasswordSuggestionsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordSuggestionsComponent);
    component = fixture.componentInstance;
    component.currentPassword = 'password';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
