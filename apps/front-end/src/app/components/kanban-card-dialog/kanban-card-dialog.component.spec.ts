import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanCardDialogComponent } from './kanban-card-dialog.component';

describe('KanbanCardDialogComponent', () => {
  let component: KanbanCardDialogComponent;
  let fixture: ComponentFixture<KanbanCardDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KanbanCardDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KanbanCardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
