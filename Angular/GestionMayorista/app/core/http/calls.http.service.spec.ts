import { TestBed } from '@angular/core/testing';

import { CallsHttpService } from './calls.http.service';

describe('CallsHttpService', () => {
  let service: CallsHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CallsHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
