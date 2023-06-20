import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessorComponent } from './accessor.component';

describe('AccessorComponent', () => {
  let component: AccessorComponent;
  let fixture: ComponentFixture<AccessorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
