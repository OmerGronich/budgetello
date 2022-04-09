import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordSuggestionsComponent } from './password-suggestions.component';

describe('PasswordSuggestionsComponent', () => {
  let component: PasswordSuggestionsComponent;
  let fixture: ComponentFixture<PasswordSuggestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordSuggestionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordSuggestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
