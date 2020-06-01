import { TestBed } from '@angular/core/testing';

import { AafModalService } from './aaf-modal.service';

describe('AafModalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AafModalService = TestBed.get(AafModalService);
    expect(service).toBeTruthy();
  });
});
