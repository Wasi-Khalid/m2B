import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierCashoutComponent } from './supplier-cashout.component';

describe('SupplierCashoutComponent', () => {
  let component: SupplierCashoutComponent;
  let fixture: ComponentFixture<SupplierCashoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierCashoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierCashoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
