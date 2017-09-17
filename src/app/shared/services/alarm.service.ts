import { Injectable, Inject } from '@angular/core';
import { HttpClient } from './http-client';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Config } from 'app/shared/services/config';
import { ActiveAlarm } from 'app/shared/models/active-alarm';

@Injectable()
export class AlarmService {

  alarmCount: number;
  activeAlarm: ActiveAlarm[] = [];
  activeAlarms: ActiveAlarm[] = [];

  constructor( @Inject(HttpClient) public http: HttpClient) { }

  // get the tile count for auto-detect.
  getAlarmCount(customerId: number, startDate: any, endDate: any, locationGroupId?: number) {
    if (locationGroupId !== undefined && locationGroupId !== null) {
      return this.http.get(Config.serviceUrl + `api/Alarms/activetotal?customerId=${customerId}
&StartTime=${startDate}&EndTime=${endDate}&LocationGroupID=${locationGroupId}`).map(res => {
          this.alarmCount = res.alarmstotal;
          return this.alarmCount;
        });
    } else {
      return this.http.get(Config.serviceUrl + `api/Alarms/activetotal?customerId=${customerId}
&StartTime=${startDate}&EndTime=${endDate}`).map(res => {
          this.alarmCount = res.alarmstotal;
          return this.alarmCount;
        });
    }
  }

  // get the tile count for auto-detect.
  getActiveAlarm(customerId: number, locationGroupId?: any) {
    if (locationGroupId === 0 || locationGroupId === null) {
      locationGroupId = undefined;
    }
    if (locationGroupId !== undefined) {
      // tslint:disable-next-line:max-line-length
      return this.http.get(Config.serviceUrl + `api/Alarms/active?customerId=${customerId}&locationGroupId=${locationGroupId}`).map(res => {
        this.activeAlarm = res;
        return this.activeAlarm;
      });
    } else {
      // tslint:disable-next-line:max-line-length
      return this.http.get(Config.serviceUrl + `api/Alarms/active?customerId=${customerId}`).map(res => {
        this.activeAlarm = res;
        return this.activeAlarm;
      });
    }
  }

  getAlarms(customerId: number, startDate: any, endDate: any, status: number, locationGroupId?: number) {
    if (locationGroupId === 0 || locationGroupId === null) {
      locationGroupId = undefined;
    }
    if (locationGroupId !== undefined) {
      if (status === 0) {
        // tslint:disable-next-line:max-line-length
        return this.http.get(Config.serviceUrl + `api/Alarms?customerId=${customerId}&StartTime=${startDate}&EndTime=${endDate}&LocationGroupId=${locationGroupId}&Active=${true}`).map(res => {
          return res;
        });
      } else if (status === 1) {
        // tslint:disable-next-line:max-line-length
        return this.http.get(Config.serviceUrl + `api/Alarms?customerId=${customerId}&StartTime=${startDate}&EndTime=${endDate}&LocationGroupId=${locationGroupId}&Acknowledged=${true}`).map(res => {
          return res;
        });
      } else if (status === 2) {
        // tslint:disable-next-line:max-line-length
        return this.http.get(Config.serviceUrl + `api/Alarms?customerId=${customerId}&StartTime=${startDate}&EndTime=${endDate}&LocationGroupId=${locationGroupId}&Cleared=${true}`).map(res => {
          return res;
        });
      } else if (status === undefined) {
        // tslint:disable-next-line:max-line-length
        return this.http.get(Config.serviceUrl + `api/Alarms?customerId=${customerId}&StartTime=${startDate}&EndTime=${endDate}&LocationGroupId=${locationGroupId}`).map(res => {
          return res;
        });
      }
    } else {
      if (status === 0) {
        // tslint:disable-next-line:max-line-length
        return this.http.get(Config.serviceUrl + `api/Alarms?customerId=${customerId}&StartTime=${startDate}&EndTime=${endDate}&Active=${true}`).map(res => {
          return res;
        });
      } else if (status === 1) {
        // tslint:disable-next-line:max-line-length
        return this.http.get(Config.serviceUrl + `api/Alarms?customerId=${customerId}&StartTime=${startDate}&EndTime=${endDate}&Acknowledged=${true}`).map(res => {
          return res;
        });
      } else if (status === 2) {
        // tslint:disable-next-line:max-line-length
        return this.http.get(Config.serviceUrl + `api/Alarms?customerId=${customerId}&StartTime=${startDate}&EndTime=${endDate}&Cleared=${true}`).map(res => {
          return res;
        });
      } else if (status === undefined) {
        // tslint:disable-next-line:max-line-length
        return this.http.get(Config.serviceUrl + `api/Alarms?customerId=${customerId}&StartTime=${startDate}&EndTime=${endDate}`).map(res => {
          return res;
        });
      }
    }
  }

  getHydrograph(customerId: number, locationId: number, startDate: any, endDate: any) {
    // tslint:disable-next-line:max-line-length
    return this.http.get(Config.serviceUrl + `api/Hydrograph?customerId=${customerId}&locationId=${locationId}&Start=${startDate}&End=${endDate}`).map(res => {
      return res;
    });
  }

} // End of class
