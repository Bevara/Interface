import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnusedComponent } from './unused.component';

describe('UnusedComponent', () => {
  let component: UnusedComponent;
  let fixture: ComponentFixture<UnusedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnusedComponent]
    });
    fixture = TestBed.createComponent(UnusedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
