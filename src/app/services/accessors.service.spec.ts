import { TestBed } from '@angular/core/testing';

import { AccessorsService } from './accessors.service';

describe('AccessorsService', () => {
  let service: AccessorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccessorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
