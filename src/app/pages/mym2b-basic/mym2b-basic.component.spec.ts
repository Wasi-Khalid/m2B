import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Mym2bBasicComponent } from './mym2b-basic.component';

describe('Mym2bBasicComponent', () => {
  let component: Mym2bBasicComponent;
  let fixture: ComponentFixture<Mym2bBasicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Mym2bBasicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Mym2bBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
