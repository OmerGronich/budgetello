import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddListFormComponent } from './add-list-form.component';

describe('AddListFormComponent', () => {
  let component: AddListFormComponent;
  let fixture: ComponentFixture<AddListFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddListFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddListFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
