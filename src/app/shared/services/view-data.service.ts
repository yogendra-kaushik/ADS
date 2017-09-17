import { Injectable, Inject } from '@angular/core';
import { HttpClient } from './http-client';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Config } from 'app/shared/services/config';

@Injectable()
export class ViewDataService {

  constructor( @Inject(HttpClient) public http: HttpClient) { }

  getHydrograph(customerId: number, locationId: number, startDate: any, endDate: any, entityIds?: number[]) {
    if (entityIds !== undefined && entityIds.length > 0) {
      let entityUrl = '';
      for (let i = 0; i < entityIds.length; i++) {
        entityUrl = entityUrl + '&EntityIds=' + entityIds[i];
      }

      // tslint:disable-next-line:max-line-length
      return this.http.get(Config.serviceUrl + `api/Hydrograph?customerId=${customerId}&locationId=${locationId}&Start=${startDate}&End=${endDate}&EntityIds=${entityUrl}`).map(res => {
        if (res === 204) {
          return null;
        }        
        return res;
      });
    } else {
      // tslint:disable-next-line:max-line-length
      return this.http.get(Config.serviceUrl + `api/Hydrograph?customerId=${customerId}&locationId=${locationId}&Start=${startDate}&End=${endDate}`).map(res => {
        if (res === 204) {
          return null;
        }
        return res;
      });
    }
  }

  // get the scattergraph details
  getScatterpgraph(customerId: number, locationId: number, start: any, end: any, entityIds?: number[]) {
    if (entityIds !== undefined && entityIds.length > 0) {
      let entityUrl = '';
      for (let i = 0; i < entityIds.length; i++) {
        entityUrl = entityUrl + '&EntityIds=' + entityIds[i];
      }

      // tslint:disable-next-line:max-line-length
      return this.http.get(Config.serviceUrl + `api/Scattergraph?customerId=${customerId}&locationId=${locationId}&Start=${start}&End=${end}&EntityIds=${entityUrl}`).map(res => {
        if (res === 204) {
          return null;
        }
        return res;
      });
    } else {
      // tslint:disable-next-line:max-line-length
      return this.http.get(Config.serviceUrl + `api/Scattergraph?customerId=${customerId}&locationId=${locationId}&Start=${start}&End=${end}`).map(res => {
        if (res === 204) {
          return null;
        }
        return res;
      });
    }
  }

} // End of class
