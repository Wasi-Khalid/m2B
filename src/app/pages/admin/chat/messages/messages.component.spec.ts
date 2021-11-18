import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { adminMessagesComponent } from './messages.component';

describe('adminMessagesComponent', () => {
  let component: adminMessagesComponent;
  let fixture: ComponentFixture<adminMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ adminMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(adminMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
