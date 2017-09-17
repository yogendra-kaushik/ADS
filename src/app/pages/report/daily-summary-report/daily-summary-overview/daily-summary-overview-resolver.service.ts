import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Resolve } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { IDailySummaryReport } from '../../../../shared/models';
import { DailySummaryReportService } from '../daily-summary-report.service';

@Injectable()
export class DailySummaryOverviewResolver implements Resolve<Observable<IDailySummaryReport>> {
  constructor(private dailySummaryService: DailySummaryReportService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IDailySummaryReport> {
    return this.dailySummaryService.getDailySummaryReport();
  }
}
