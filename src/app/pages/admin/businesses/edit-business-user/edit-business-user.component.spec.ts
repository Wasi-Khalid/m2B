import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBusinessUserComponent } from './edit-business-user.component';

describe('EditBusinessUserComponent', () => {
  let component: EditBusinessUserComponent;
  let fixture: ComponentFixture<EditBusinessUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBusinessUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBusinessUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
