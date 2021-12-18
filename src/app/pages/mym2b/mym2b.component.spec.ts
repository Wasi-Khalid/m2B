import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Mym2bComponent } from './mym2b.component';

describe('Mym2bComponent', () => {
  let component: Mym2bComponent;
  let fixture: ComponentFixture<Mym2bComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Mym2bComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Mym2bComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
