import { TestBed } from '@angular/core/testing';

import { ChartsHttpService } from './charts.http.service';

describe('ChartsHttpService', () => {
  let service: ChartsHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartsHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
