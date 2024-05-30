import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanDialogComponent } from './kanban-dialog.component';

describe('KanbanDialogComponent', () => {
  let component: KanbanDialogComponent;
  let fixture: ComponentFixture<KanbanDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KanbanDialogComponent]
    });
    fixture = TestBed.createComponent(KanbanDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
