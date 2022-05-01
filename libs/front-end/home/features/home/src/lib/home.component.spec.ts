import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeFacade } from '@budgetello/front-end/home/domain';
import { createdBoardId, existingBoardId } from './tests/mocks';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { of } from 'rxjs';
import { HomeModule } from './home.module';
import { Router, RouterLink } from '@angular/router';
import { By } from '@angular/platform-browser';

class HomeFacadeMock {
  destroy = jest.fn();
  init = jest.fn();
  addBoard = jest.fn(({ title }) => {
    return {
      title,
      id: createdBoardId,
    };
  });
  boards$ = of([
    {
      title: 'existing board',
      id: existingBoardId,
    },
  ]);
}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let homeFacade: HomeFacade;

  @Component({
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  class BlankComponent {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HomeModule,
        RouterTestingModule.withRoutes([
          { path: `board/${createdBoardId}`, component: BlankComponent },
        ]),
      ],
      providers: [{ provide: HomeFacade, useClass: HomeFacadeMock }],
      declarations: [HomeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    homeFacade = TestBed.inject(HomeFacade);
    jest.spyOn(homeFacade, 'init');
    jest.spyOn(homeFacade, 'destroy');
    jest.spyOn(homeFacade, 'addBoard');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call homeFacade.init once', () => {
    expect(homeFacade.init).toHaveBeenCalledTimes(1);
  });

  it('should call homeFacade.destroy once', () => {
    expect(homeFacade.init).toHaveBeenCalledTimes(1);
  });

  it('should construct the correct board link', () => {
    const routerLink = fixture.debugElement.query(By.directive(RouterLink));
    expect(routerLink.attributes['ng-reflect-router-link']).toEqual(
      `board/${existingBoardId}`
    );
  });

  describe('onCreateBoard', () => {
    it('should call homeFacade.addBoard with the correct title', () => {
      component.onCreateBoard({ title: 'test' });
      expect(homeFacade.addBoard).toHaveBeenCalledWith({ title: 'test' });
    });

    it('should navigate to the created board', waitForAsync(() => {
      const router = TestBed.inject(Router);
      const spy = jest.spyOn(router, 'navigate');
      component.onCreateBoard({ title: 'test' }).then(() => {
        expect(spy).toHaveBeenCalledWith(['/board', createdBoardId]);
      });
    }));

    it('should not navigate to the created board if the board is not created', waitForAsync(() => {
      homeFacade.addBoard = jest.fn().mockImplementation(() => {
        throw new Error('Blah');
      });
      const router = TestBed.inject(Router);
      const spy = jest.spyOn(router, 'navigate');
      component.onCreateBoard({ title: 'test' }).then(() => {
        expect(spy).not.toHaveBeenCalled();
      });
    }));
  });
});
