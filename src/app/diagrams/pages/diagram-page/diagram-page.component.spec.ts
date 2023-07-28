import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagramPageComponent } from './diagram-page.component';

describe('DiagramPageComponent', () => {
  let component: DiagramPageComponent;
  let fixture: ComponentFixture<DiagramPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiagramPageComponent]
    });
    fixture = TestBed.createComponent(DiagramPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
