import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierUnderConstructionComponent } from './supplier-under-construction.component';

describe('SupplierUnderConstructionComponent', () => {
  let component: SupplierUnderConstructionComponent;
  let fixture: ComponentFixture<SupplierUnderConstructionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierUnderConstructionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierUnderConstructionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
