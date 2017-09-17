import { Injectable, Inject } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { HttpClient } from './http-client';
import { Config } from './config';
import { CustomerService } from 'app/shared/services/customer.service';

@Injectable()
export class LocationDashboardService {

  constructor( @Inject(HttpClient) public http: HttpClient, private customerService: CustomerService) { }

  getMapViews() {
    return this.http.get(Config.urls.mapviews);
  }

  getMapTypes() {
    return this.http.get(Config.urls.maptypes);
  }

  getLocations(customerId: number, locationGroupId?: number) {
    if (locationGroupId === 0) {
      locationGroupId = undefined;
    }
    if (locationGroupId !== undefined) {
      return this.http.get(Config.serviceUrl + `data/locations/${customerId}?locationGroupId=${locationGroupId}`);
    } else {
      return this.http.get(Config.serviceUrl + `data/locations/${customerId}`);
    }
  }

  getLocationDetails(locationId: number): any {
    let uri = `${Config.serviceUrl}/data/details/${this.customerService.customerId}/${locationId}`

    return this.http.get(uri);
  }
}
