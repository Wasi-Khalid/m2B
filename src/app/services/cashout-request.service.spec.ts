import { TestBed } from '@angular/core/testing';

import { CashoutRequestService } from './cashout-request.service';

describe('CashoutRequestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CashoutRequestService = TestBed.get(CashoutRequestService);
    expect(service).toBeTruthy();
  });
});
