import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourierOrderListComponent } from './courier-order-list.component';

describe('CourierOrderListComponent', () => {
  let component: CourierOrderListComponent;
  let fixture: ComponentFixture<CourierOrderListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourierOrderListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourierOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
