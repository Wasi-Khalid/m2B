import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierCashoutFinalComponent } from './supplier-cashout-final.component';

describe('SupplierCashoutFinalComponent', () => {
  let component: SupplierCashoutFinalComponent;
  let fixture: ComponentFixture<SupplierCashoutFinalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierCashoutFinalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierCashoutFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
