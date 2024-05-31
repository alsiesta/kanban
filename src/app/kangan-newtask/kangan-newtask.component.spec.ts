import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanganNewtaskComponent } from './kangan-newtask.component';

describe('KanganNewtaskComponent', () => {
  let component: KanganNewtaskComponent;
  let fixture: ComponentFixture<KanganNewtaskComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KanganNewtaskComponent]
    });
    fixture = TestBed.createComponent(KanganNewtaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
