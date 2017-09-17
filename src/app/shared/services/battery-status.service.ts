import { Injectable, Inject } from '@angular/core';
import { Http, RequestOptions, URLSearchParams, Headers, Response } from '@angular/http';
import { HttpClient } from './http-client';
import { Config } from './config';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { BatteryTotalCount } from 'app/shared/models/battery-total-count';
import { BatteryStatus } from 'app/shared/models/battery-status';
import { AuthService } from './auth.service';


@Injectable()
export class BatteryStatusService {
    batteryTotalCount: BatteryTotalCount;
    batteryStatus: BatteryStatus[] = [];

    constructor( @Inject(HttpClient) public http: HttpClient, public authService: AuthService) { }

    getBatteryStatus(customerId: number, locationGroupID?: number, locationID?: number, voltage?: number, status?: string): Observable<any> {
        let url = Config.serviceUrl + 'api/BatteryStatus/locations?CustomerID=' + customerId;
        if (locationGroupID > 0) {
            url = url + '&LocationGroupID=' + locationGroupID;
        }
        if (locationID > 0) {
            url = url + '&LocationID=' + locationID;
        }
        if (voltage) {
            url = url + '&Voltage=' + voltage;
        }
        if (status) {
            url = url + '&Status=' + status;
        }

        return this.http.get(url)
            .map(res => {
                if (res === 204) {
                    return null;
                } else {
                    this.batteryStatus = res.listBatteries;
                    return this.batteryStatus;
                }
            });
    }

    getBatteryStatusTotal(customerId, locationGroupId?: any) {
        if (locationGroupId === 0) {
            locationGroupId = undefined;
        }
        if (locationGroupId !== undefined) {
            // tslint:disable-next-line:max-line-length
            return this.http.get(Config.serviceUrl + 'api/BatteryStatus/total?CustomerID=' + customerId + '&LocationGroupID=' + locationGroupId).map(res => {
                this.batteryTotalCount = res;
                return this.batteryTotalCount;
            });
        } else {
            return this.http.get(Config.serviceUrl + 'api/BatteryStatus/total?CustomerID=' + customerId).map(res => {
                this.batteryTotalCount = res;
                return this.batteryTotalCount;
            });
        }
    }
}