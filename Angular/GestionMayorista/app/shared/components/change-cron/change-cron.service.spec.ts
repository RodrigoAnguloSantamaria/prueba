/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ChangeCronService } from './change-cron.service';

describe('Service: ChangeCron', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChangeCronService]
    });
  });

  it('should ...', inject([ChangeCronService], (service: ChangeCronService) => {
    expect(service).toBeTruthy();
  }));
});
