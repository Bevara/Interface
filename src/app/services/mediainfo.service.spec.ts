import { TestBed } from '@angular/core/testing';

import { MediainfoService } from './mediainfo.service';

describe('MediainfoService', () => {
  let service: MediainfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediainfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
