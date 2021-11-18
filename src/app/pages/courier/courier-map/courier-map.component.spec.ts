import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourierMapComponent } from './courier-map.component';

describe('CourierMapComponent', () => {
  let component: CourierMapComponent;
  let fixture: ComponentFixture<CourierMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourierMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourierMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
