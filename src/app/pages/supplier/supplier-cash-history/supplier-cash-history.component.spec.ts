import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierCashHistoryComponent } from './supplier-cash-history.component';

describe('SupplierCashHistoryComponent', () => {
  let component: SupplierCashHistoryComponent;
  let fixture: ComponentFixture<SupplierCashHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierCashHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierCashHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
