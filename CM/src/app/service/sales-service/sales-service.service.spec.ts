import { TestBed } from '@angular/core/testing';

import { SalesService } from './sales-service.service';

describe('SalesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SalesService = TestBed.get(SalesService);
    expect(service).toBeTruthy();
  });
});
