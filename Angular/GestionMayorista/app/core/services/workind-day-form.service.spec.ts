import { TestBed } from '@angular/core/testing';

import { WorkindDayFormService } from './workind-day-form.service';

describe('WorkindDayFormService', () => {
  let service: WorkindDayFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkindDayFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
