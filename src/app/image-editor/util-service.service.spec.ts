import { TestBed, inject } from '@angular/core/testing';

import { UtilServiceService } from './util-service.service';

describe('UtilServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UtilServiceService]
    });
  });

  it('should be created', inject([UtilServiceService], (service: UtilServiceService) => {
    expect(service).toBeTruthy();
  }));
});
