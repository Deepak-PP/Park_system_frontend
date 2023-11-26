import { TestBed } from '@angular/core/testing';

import { ParklotService } from './parklot.service';

describe('ParklotService', () => {
  let service: ParklotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParklotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
