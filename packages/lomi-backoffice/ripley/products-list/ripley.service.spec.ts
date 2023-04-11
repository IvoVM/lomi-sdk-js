import { TestBed } from '@angular/core/testing';

import { RipleyService } from './ripley.service';

describe('RipleyService', () => {
  let service: RipleyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RipleyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
