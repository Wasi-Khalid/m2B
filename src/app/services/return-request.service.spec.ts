import { TestBed } from '@angular/core/testing';

import { ReturnRequestService } from './return-request.service';

describe('ReturnRequestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReturnRequestService = TestBed.get(ReturnRequestService);
    expect(service).toBeTruthy();
  });
});
