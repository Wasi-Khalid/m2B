import { TestBed } from '@angular/core/testing';

import { SupplierOrderListService } from './supplier-order-list-service.service';

describe('SupplierOrderListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SupplierOrderListService = TestBed.get(SupplierOrderListService);
    expect(service).toBeTruthy();
  });
});
