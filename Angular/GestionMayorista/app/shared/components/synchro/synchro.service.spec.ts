/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SynchroService } from './synchro.service';

describe('Service: Synchro', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SynchroService]
    });
  });

  it('should ...', inject([SynchroService], (service: SynchroService) => {
    expect(service).toBeTruthy();
  }));
});
