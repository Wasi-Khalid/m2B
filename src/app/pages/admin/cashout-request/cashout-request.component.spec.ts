import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CashoutRequestComponent } from './cashout-request.component';

describe('CashoutRequestComponent', () => {
  let component: CashoutRequestComponent;
  let fixture: ComponentFixture<CashoutRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CashoutRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashoutRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
