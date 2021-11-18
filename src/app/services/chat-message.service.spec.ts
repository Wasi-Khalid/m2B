import { TestBed } from '@angular/core/testing';

import { ChatMessageService } from './chat-message.service';

describe('ChatMessageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChatMessageService = TestBed.get(ChatMessageService);
    expect(service).toBeTruthy();
  });
});
