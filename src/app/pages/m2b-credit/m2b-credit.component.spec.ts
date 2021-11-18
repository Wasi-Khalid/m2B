import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { M2bCreditComponent } from './m2b-credit.component';

describe('M2bCreditComponent', () => {
  let component: M2bCreditComponent;
  let fixture: ComponentFixture<M2bCreditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ M2bCreditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(M2bCreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
