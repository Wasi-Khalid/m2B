import { TestBed, inject } from '@angular/core/testing';

import { LoggedInAsService } from './logged-in-as.service';

describe('LoggedInAsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoggedInAsService]
    });
  });

  it('should be created', inject([LoggedInAsService], (service: LoggedInAsService) => {
    expect(service).toBeTruthy();
  }));
});
