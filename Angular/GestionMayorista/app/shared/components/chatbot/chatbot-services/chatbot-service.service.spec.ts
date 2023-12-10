/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ChatbotServiceService } from './chatbot-service.service';

describe('Service: ChatbotService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChatbotServiceService]
    });
  });

  it('should ...', inject([ChatbotServiceService], (service: ChatbotServiceService) => {
    expect(service).toBeTruthy();
  }));
});
