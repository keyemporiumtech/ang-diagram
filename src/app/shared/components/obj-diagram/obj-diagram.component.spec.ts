import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjDiagramComponent } from './obj-diagram.component';

describe('ObjDiagramComponent', () => {
  let component: ObjDiagramComponent;
  let fixture: ComponentFixture<ObjDiagramComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ObjDiagramComponent]
    });
    fixture = TestBed.createComponent(ObjDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
