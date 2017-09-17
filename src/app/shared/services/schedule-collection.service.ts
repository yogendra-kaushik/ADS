import { Injectable, Inject } from '@angular/core';
import { HttpClient } from './http-client';
import { Config } from './config';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { ScheduleCollection } from 'app/shared/models/schedule-collection';
import { CollectionHistory } from 'app/shared/models/collection-history';


@Injectable()
export class ScheduleCollectionService {
  collectionHistory: CollectionHistory[];
  constructor( @Inject(HttpClient) public http: HttpClient) { }

  getFailedCollection(customerId: number, locationGroupId?: any) {
    if (locationGroupId === 0) {
      locationGroupId = undefined;
    }
    if (locationGroupId !== undefined) {
      // tslint:disable-next-line:max-line-length
      return this.http.get(Config.serviceUrl + `api/collections/count?customerId=${customerId}&locationGroupId=${locationGroupId}`).map(res => {
        return res.failedcollections;
      });
    } else {
      return this.http.get(Config.serviceUrl + `api/collections/count?customerId=${customerId}`).map(res => {
        return res.failedcollections;
      });
    }
  }

  getUpcomingCollection(customerId: number) {
    return this.http.get(Config.serviceUrl + `api/collections/api/collect/next?customerId=${customerId}`).map(res => {
      return res.collectionstart;
    });
  }

  getFailedAndUpcomingCollection(customerId: number) {
    return this.http.get(Config.serviceUrl + `api/collections/count?customerID=${customerId}`).map(res => {
      return res;
    });

  }
  getScheduleCollection(customerId: number): Observable<any> {
    return this.http.get(Config.serviceUrl + `api/collections/schedules?customerID=${customerId}`)
      .map(response => <ScheduleCollection>response);
  }

  getCollectionHistory(customerId: number, locationGroupId?: number, locations?: number[], startDate?: any, endDate?: any) {
    if (locationGroupId === 0) {
      locationGroupId = undefined;
    }
    if (locationGroupId !== undefined) {
      if (locations !== undefined && locations.length > 0) {
        let locationUrl = '';
        for (let i = 0; i < locations.length; i++) {
          locationUrl = locationUrl + '&LocationIDs=' + locations[i];
        }
        if (startDate !== undefined) {
          // tslint:disable-next-line:max-line-length
          return this.http.get(Config.serviceUrl + `api/collections/history?customerID=${customerId}&LocationGroupID=${locationGroupId}${locationUrl}&StartTime=${startDate}&EndTime=${endDate}`).map(res => {
            return res;
          });
        } else {
          // tslint:disable-next-line:max-line-length
          return this.http.get(Config.serviceUrl + `api/collections/history?customerID=${customerId}&LocationGroupID=${locationGroupId}${locationUrl}`).map(res => {
            return res;
          });
        }
      } else if (startDate !== undefined) {
        // tslint:disable-next-line:max-line-length
        return this.http.get(Config.serviceUrl + `api/collections/history?customerID=${customerId}&LocationGroupID=${locationGroupId}&StartTime=${startDate}&EndTime=${endDate}`).map(res => {
          return res;
        });
      } else {
        // tslint:disable-next-line:max-line-length
        return this.http.get(Config.serviceUrl + `api/collections/history?customerID=${customerId}&LocationGroupID=${locationGroupId}`).map(res => {
          return res;
        });
      }
    } else {
      if (locations !== undefined && locations.length > 0) {
        let locationUrl = '';
        for (let i = 0; i < locations.length; i++) {
          locationUrl = locationUrl + '&LocationIDs=' + locations[i];
        }
        if (startDate !== undefined) {
          // tslint:disable-next-line:max-line-length
          return this.http.get(Config.serviceUrl + `api/collections/history?customerID=${customerId}${locationUrl}&StartTime=${startDate}&EndTime=${endDate}`).map(res => {
            return res;
          });
        } else {
          return this.http.get(Config.serviceUrl + `api/collections/history?customerID=${customerId}${locationUrl}`).map(res => {
            return res;
          });
        }
      } else if (startDate !== undefined) {
        // tslint:disable-next-line:max-line-length
        return this.http.get(Config.serviceUrl + `api/collections/history?customerID=${customerId}&StartTime=${startDate}&EndTime=${endDate}`).map(res => {
          return res;
        });
      } else {
        return this.http.get(Config.serviceUrl + `api/collections/history?customerID=${customerId}`).map(res => {
          return res;
        });
      }
    }
  }

  postScheduleCollection(customerId: number, scheduleCollection: ScheduleCollection) {
    // below is api url for add collection schedule
    let res = this.http.post(Config.serviceUrl + `api/collections/schedules?customerID=${customerId}`, scheduleCollection);

    res.catch(error => {
      console.dir(error.json());
      return res;
    });
    return res;
  }

  updateScheduleCollection(customerId: number, locations: number[], name: string, frequency: number, alarmingFrequency: number,
    daysToCollect: string[]) {
    let locationUrl = '';
    for (let i = 0; i < locations.length; i++) {
      locationUrl = locationUrl + (i > 0 ? '&locations=' : 'locations=') + locations[i];
    }

    let daysToCollectUrl = '';
    for (let i = 0; i < daysToCollect.length; i++) {
      daysToCollectUrl = daysToCollectUrl + '&DaysToCollect=' + daysToCollect[i];
    }

    // below is api url for update collection schedule
    // tslint:disable-next-line:max-line-length
    let res = this.http.put(Config.serviceUrl + `api/collections/schedules/${customerId}?${locationUrl}&Name=${name}&Frequency=${frequency}${daysToCollectUrl}&AlarmingFrequency=${alarmingFrequency}`, {});

    res.catch(error => {
      console.dir(error.json());
      return res;
    });
    return res;
  }

  deleteScheduleCollection(scheduleId: number): Observable<any> {
    return this.http.delete(Config.serviceUrl + `api/collections/schedules/${scheduleId}`)
      .map(response => <ScheduleCollection>response);
  }
}
