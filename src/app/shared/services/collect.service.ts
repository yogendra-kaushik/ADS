import { Injectable, Inject } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { HttpClient } from './http-client';
import { Config } from './config';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()
export class CollectService {
    constructor(@Inject(HttpClient) public http: HttpClient) { }

    collectLocation(customerId: number, locationId: number) {

        /*this.http.post(Config.serviceUrl + 'api/collect/' + customerId + '/' + locationId, '')
            .map((res: Response) => console.log('Result: ' + res.status))
            .subscribe (
                (data) => console.log(data),
                (err) => console.log(err))    
        */        
    return this.http.post(Config.serviceUrl + 'api/collections/location?customerId=' + customerId + '&locationId=' + locationId, '');    }
}

