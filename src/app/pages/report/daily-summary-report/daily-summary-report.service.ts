import { Inject, Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient } from '../../../shared/services/http-client';

import { Observable } from 'rxjs/Observable';

import { Config } from '../../../shared/services/config';
import { LocationDetails } from '../../../shared/models/location-details';
import { IDailySummaryReport, IDailySummaryLocationDetail } from '../../../shared/models';
import { CustomerService } from 'app/shared/services';
import { LocationGroupService } from 'app/shared/services/location-group.service';

@Injectable()
export class DailySummaryReportService {

  constructor( @Inject(HttpClient) private http: HttpClient, private customerService: CustomerService,
    private locationGroupService: LocationGroupService) { }

  /**
   * Retrieves all the locations for the given client for daily summary overview.
   */
  public getDailySummaryReport(): Observable<IDailySummaryReport> {

    // build uri for selected custom
    let uri = `${Config.urls.dataSummaryReportOverview}?`;

    // ensure customer id is specified
    if (this.customerService.customerId != null && this.customerService.customerId !== undefined) {
      uri += `CustomerId=${this.customerService.customerId}`;
    }

    // use group id if it is filled as part of query string
    if (this.locationGroupService.locationGroupID !== null && this.locationGroupService.locationGroupID !== undefined) {
      uri += `&LocationGroupId=${this.locationGroupService.locationGroupID}`;
    }

    // call service
    return this.http.get(uri);
  }

  /**
   * Retrieves the last week for the specific location id.
   * @param id The location identifier.
   */
  public getLocationDetails(id: number): Observable<IDailySummaryLocationDetail> {

    let locationUri = `${Config.urls.locationDetails}/${this.customerService.customerId}/${id}`;

    // create observable for retrieving the locaiton information
    let locationObservable: Observable<LocationDetails> = this.http.get(locationUri);

    // get daily summary report uri
    let summaryUri = `${Config.urls.dataSummaryReportDetails}?LocationIds=${id}`;

    // ensure customer id is specified
    if (this.customerService.customerId != null && this.customerService.customerId !== undefined) {
      summaryUri += `&CustomerId=${this.customerService.customerId}`;
    }

    // use group id if it is filled as part of query string
    if (this.locationGroupService.locationGroupID !== null && this.locationGroupService.locationGroupID !== undefined) {
      summaryUri += `&LocationGroupId=${this.locationGroupService.locationGroupID}`;
    }

    // setup observable for daily summary call
    let summaryObservable: Observable<IDailySummaryLocationDetail> = this.http.get(summaryUri);

    // join location and summary calls
    return Observable
      .forkJoin(locationObservable, summaryObservable)
      .map((result: [LocationDetails, IDailySummaryLocationDetail]) => <IDailySummaryLocationDetail>{
        locationName: result[0].locationName,
        report: result[1]
      });
  }
}
