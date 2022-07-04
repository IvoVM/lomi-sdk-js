import { TestBed } from '@angular/core/testing';

import { LomiService } from './lomi.service';

describe('LomiService', () => {
  let service: LomiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LomiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
