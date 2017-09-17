import { TestBed, inject } from '@angular/core/testing';

import { DailySummaryDetailsResolverService } from './daily-summary-details-resolver.service';

describe('DailySummaryDetailsResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DailySummaryDetailsResolverService]
    });
  });

  it('should be created', inject([DailySummaryDetailsResolverService], (service: DailySummaryDetailsResolverService) => {
    expect(service).toBeTruthy();
  }));
});
