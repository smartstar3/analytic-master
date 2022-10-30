import { TestBed } from '@angular/core/testing';

import { CarouselService } from './carousel.service';

describe('AnimationService', () => {
  let service: CarouselService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarouselService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
