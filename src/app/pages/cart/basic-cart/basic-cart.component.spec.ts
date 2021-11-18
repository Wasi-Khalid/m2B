import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicCartComponent } from './basic-cart.component';

describe('BasicCartComponent', () => {
  let component: BasicCartComponent;
  let fixture: ComponentFixture<BasicCartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicCartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
