import { Injectable, Inject } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { HttpClient } from './http-client';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { Config } from './config';
import { DateService } from './date.service';

@Injectable()
export class CrowdCoreService {

    constructor( @Inject(HttpClient) public http: HttpClient, private dateService: DateService) { }

    // method returns  { customerId, locationId, timestamp, urlToImage, imageId }
    getImages() {
        return this.http.get(Config.urls.crowdcoreJudgements);
    }

    getStatus() {
        return this.http.get(Config.urls.crowdcoreStatus);
    }
    /* (`GET /api/judgements/top5`) */
    getTopScores() {
        return this.http.get(Config.urls.crowdcoreTopScore);
    }

    getSubmissions(startDate: Date, endDate: Date) {
        let start = this.dateService.formatDate(startDate);
        let end = this.dateService.formatDate(endDate);
        let url = `${Config.urls.submissionsCount}?startDate=${start}&endDate=${end}`;
        console.log(url);
        return this.http.get(url);
    }

    postInput(imageInfo: Object) {
        let res = this.http.post(Config.urls.crowdcoreJudgements, imageInfo);
        res.catch(error => {
            console.dir(error.json());
            return res;
        });
        return res;

        /*
         this.http.post('https://jsonplaceholder.typicode.com/posts', imageInfo)
             .map( res => res.json()
         );
         .map(
             (res:Response) => res.json()
         )
         .subscribe(
             (res: Response) => { console.log(res); }
         )
         */
    }
}
