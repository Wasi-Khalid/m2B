import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalCartComponent } from './final-cart.component';

describe('FinalCartComponent', () => {
  let component: FinalCartComponent;
  let fixture: ComponentFixture<FinalCartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinalCartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
