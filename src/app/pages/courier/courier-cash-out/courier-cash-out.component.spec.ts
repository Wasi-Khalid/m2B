import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourierCashOutComponent } from './courier-cash-out.component';

describe('CourierCashOutComponent', () => {
  let component: CourierCashOutComponent;
  let fixture: ComponentFixture<CourierCashOutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourierCashOutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourierCashOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
