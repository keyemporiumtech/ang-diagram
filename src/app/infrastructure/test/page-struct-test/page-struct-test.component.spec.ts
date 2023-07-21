import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageStructTestComponent } from './page-struct-test.component';

describe('PageStructTestComponent', () => {
  let component: PageStructTestComponent;
  let fixture: ComponentFixture<PageStructTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PageStructTestComponent]
    });
    fixture = TestBed.createComponent(PageStructTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
