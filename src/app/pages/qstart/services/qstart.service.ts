import { Injectable, Inject } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { HttpClient } from '../../../shared/services/http-client';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Config } from '../../../shared/services/config';

@Injectable()
export class QstartDataService {
    constructor( @Inject(HttpClient) public http: HttpClient) {
    }
    // tslint:disable-next-line:member-ordering
    items: Array<any> = [
        {
            name: 'Huntsville',
            id: 1
        },
        {
            name: 'Birmingham',
            id: 2
        }];



    getItems() {
        return this.items;
    }

    // Get monitor status
    getMonitorStatus(id: number) {
        return this.http.get(Config.urls.qstartBaseUrl + id + '/status');
    }

    // Get monitor configuration
    getMonitorConfiguration(id: number) {
        return this.http.get(Config.urls.qstartBaseUrl + id + '/configuration');
    }

    // Disconnect from monitor
    disconnectMonitor(id: number) {
        return this.http.get(Config.urls.qstartBaseUrl + id + '/disconnect');
    }

    // Get power configuration for monitor
    getModemPowerConfig(id: number) {
        return this.http.get(Config.urls.qstartBaseUrl + id + '/modempower');
    }

    //Read ECHO long range depth sensor
    getLongRangeDepth(id: number) {
        return this.http.get(Config.urls.qstartBaseUrl + id + '/echodepth');
    }

    //Read rain sensor
    getRain(id: number) {
        return this.http.get(Config.urls.qstartBaseUrl + id + '/echorain');
    }
}

