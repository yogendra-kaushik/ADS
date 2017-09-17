import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Resolve } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { DailySummaryReportService } from '../daily-summary-report.service';
import { IDailySummaryLocationDetail } from '../../../../shared/models';

@Injectable()
export class DailySummaryDetailsResolverService implements Resolve<Observable<IDailySummaryLocationDetail>> {

  constructor(private dailySummaryService: DailySummaryReportService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IDailySummaryLocationDetail> {

    let locationId = route.params['id'] || 0;

    return this.dailySummaryService.getLocationDetails(locationId);
  }
}
