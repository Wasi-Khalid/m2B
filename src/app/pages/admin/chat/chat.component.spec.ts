import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { adminChatComponent } from './chat.component';

describe('ChatComponent', () => {
  let component: adminChatComponent;
  let fixture: ComponentFixture<adminChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ adminChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(adminChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
