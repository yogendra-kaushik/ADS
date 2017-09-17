import { Injectable, Inject } from '@angular/core';
import { HttpClient } from './http-client';
import { Config } from './config';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { AutoScrubSummary } from 'app/shared/models/auto-scrub-summary';
import { AutoScrubDetails } from 'app/shared/models/auto-scrub-details';

@Injectable()
export class AutoScrubSummaryService {
  autoScrubDetails: AutoScrubSummary[];
  autoScrubSummaryDetails: AutoScrubSummary[];
  auroScrubHydroDetails: AutoScrubDetails[];
  autoReviewCount: number;
  constructor( @Inject(HttpClient) public http: HttpClient) { }

  public getAutoScrubSummary(locationId: number[], customerId: number, startDate: any, endDate: any,
    anomalyThreshold: number, locationGroupId?: number) {
    if (locationGroupId === 0 || locationGroupId === null) {
      locationGroupId = undefined;
    }
    if (locationGroupId !== undefined) {
      if (locationId === undefined || locationId.length === 0) {
        // tslint:disable-next-line:max-line-length
        return this.http.get(Config.serviceUrl + `api/anomalies/summary?LocationGroupId=${locationGroupId}&CustomerId=${customerId}&StartDate=${startDate}&EndDate=${endDate}&AnomalyThreshold=${anomalyThreshold}`).map(res => {
          this.autoScrubDetails = res;
          return this.autoScrubDetails;
        });
      } else {

        // create location parameter url based on selected location
        let locationUrl = '';
        for (let i = 0; i < locationId.length; i++) {
          locationUrl = locationUrl + (i > 0 ? '&Locations=' : 'Locations=') + locationId[i];
        }

        return this.http.get(Config.serviceUrl + `api/anomalies/summary?${locationUrl}
&LocationGroupId=${locationGroupId}&CustomerId=${customerId}&StartDate=${startDate}&EndDate=${endDate}
&AnomalyThreshold=${anomalyThreshold}`).map(res => {
            this.autoScrubDetails = res;
            return this.autoScrubDetails;
          });
      }
    } else {
      if (locationId === undefined || locationId.length === 0) {
        // tslint:disable-next-line:max-line-length
        return this.http.get(Config.serviceUrl + `api/anomalies/summary?CustomerId=${customerId}&StartDate=${startDate}&EndDate=${endDate}&AnomalyThreshold=${anomalyThreshold}`).map(res => {
          this.autoScrubDetails = res;
          return this.autoScrubDetails;
        });
      } else {

        // create location parameter url based on selected location
        let locationUrl = '';
        for (let i = 0; i < locationId.length; i++) {
          locationUrl = locationUrl + (i > 0 ? '&Locations=' : 'Locations=') + locationId[i];
        }

        return this.http.get(Config.serviceUrl + `api/anomalies/summary?${locationUrl}
&CustomerId=${customerId}&StartDate=${startDate}&EndDate=${endDate}&AnomalyThreshold=${anomalyThreshold}`).map(res => {
            this.autoScrubDetails = res;
            return this.autoScrubDetails;
          });
      }
    }
  }

  getAutoScrubDetails(locationId: number, customerId: number, startDate: any, endDate: any) {
    // tslint:disable-next-line:max-line-length
    return this.http.get(Config.serviceUrl + `api/anomalies?Locations=${locationId}&CustomerId=${customerId}&StartDate=${startDate}&EndDate=${endDate}`).map(res => {
      this.auroScrubHydroDetails = res.listAnomalies;
      return this.auroScrubHydroDetails;
    });
  }

  // get the tile count for auto-detect.
  getAutoDetectCount(customerId: number, locationGroupId?: number, startDate?: any, endDate?: any) {
    if (locationGroupId === 0) {
      locationGroupId = undefined;
    }
    if (locationGroupId !== undefined) {
      // tslint:disable-next-line:max-line-length
      return this.http.get(Config.serviceUrl + `api/anomalies/count?LocationGroupId=${locationGroupId}&CustomerId=${customerId}&StartDate=${startDate}&EndDate=${endDate}`).map(res => {
        this.autoReviewCount = res.count;
        return this.autoReviewCount;
      });
    } else {
      // tslint:disable-next-line:max-line-length
      return this.http.get(Config.serviceUrl + `api/anomalies/count?CustomerId=${customerId}&StartDate=${startDate}&EndDate=${endDate}`).map(res => {
        this.autoReviewCount = res.count;
        return this.autoReviewCount;
      });
    }
  }
}
