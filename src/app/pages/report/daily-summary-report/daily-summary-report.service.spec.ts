import { TestBed, inject } from '@angular/core/testing';

import { DailySummaryReportService } from './daily-summary-report.service';

describe('DailySummaryReportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DailySummaryReportService]
    });
  });

  it('should be created', inject([DailySummaryReportService], (service: DailySummaryReportService) => {
    expect(service).toBeTruthy();
  }));
});
