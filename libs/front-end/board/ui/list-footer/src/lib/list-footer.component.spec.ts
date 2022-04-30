import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFooterComponent } from './list-footer.component';
import { ListFooterModule } from './list-footer.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { AuthFacade } from '@budgetello/front-end-shared-domain';
import { MessageService } from 'primeng/api';

class AuthFacadeMock {
  user$ = of({});
}

describe('ListFooterComponent', () => {
  let component: ListFooterComponent;
  let fixture: ComponentFixture<ListFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListFooterModule, HttpClientTestingModule],
      declarations: [ListFooterComponent],
      providers: [
        { provide: AuthFacade, useClass: AuthFacadeMock },
        MessageService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
