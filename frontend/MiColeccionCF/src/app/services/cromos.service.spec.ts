import { TestBed } from '@angular/core/testing';

import { CromosService } from './cromos.service';

describe('CromosService', () => {
  let service: CromosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CromosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
