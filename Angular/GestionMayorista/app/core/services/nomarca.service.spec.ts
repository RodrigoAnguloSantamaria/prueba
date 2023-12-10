import { TestBed } from '@angular/core/testing';

import { NomarcaService } from './nomarca.service';

describe('NomarcaService', () => {
  let service: NomarcaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NomarcaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
