import { TestBed } from '@angular/core/testing';

import { LastMileProvidersService } from './last-mile-providers.service';

describe('LastMileProvidersService', () => {
  let service: LastMileProvidersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LastMileProvidersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
