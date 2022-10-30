import { TestBed } from '@angular/core/testing';

import { MessengerService } from './messenger.service';
import { MessengerModule } from './messenger.module';

describe('MessegerService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [MessengerModule],
    })
  );

  it('should be created', () => {
    const service: MessengerService = TestBed.inject(MessengerService);
    expect(service).toBeTruthy();
  });
});
