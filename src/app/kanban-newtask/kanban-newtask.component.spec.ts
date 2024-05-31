import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KanbanNewtaskComponent } from './kanban-newtask.component';

describe('KanbanNewtaskComponent', () => {
  let component: KanbanNewtaskComponent;
  let fixture: ComponentFixture<KanbanNewtaskComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KanbanNewtaskComponent]
    });
    fixture = TestBed.createComponent(KanbanNewtaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
