import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnRequestForSupplierComponent } from './return-request-for-supplier.component';

describe('ReturnRequestForSupplierComponent', () => {
  let component: ReturnRequestForSupplierComponent;
  let fixture: ComponentFixture<ReturnRequestForSupplierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnRequestForSupplierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnRequestForSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
