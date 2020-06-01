import { TestBed } from '@angular/core/testing';

import { CommonDialogService } from './common-dialog.service';

describe('CommonDialogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CommonDialogService = TestBed.get(CommonDialogService);
    expect(service).toBeTruthy();
  });
});
