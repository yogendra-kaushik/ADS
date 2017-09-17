import { Injectable, Inject } from '@angular/core';
import { HttpClient } from './http-client';
import { Config } from './config';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { BlockagePrediction } from '../models/blockage-prediction';

@Injectable()
export class BlockagePredictionService {
  bPDetails: BlockagePrediction[] = [];
  blockagePredictionCount: number;
  constructor( @Inject(HttpClient) public http: HttpClient) { }

  getBlockagePrediction(customerId: number) {
    return this.http.get(Config.serviceUrl + 'ml/blockageprediction/top5/' + customerId).map(res => {
      this.bPDetails = res;
      return this.bPDetails;
    });
  }

  getBlockagePredictionWidget(customerId: number, index: number, pageSize: number, startDate: any, endDate: any, locationGroupId?: any) {

    if (locationGroupId === 0 || locationGroupId === null) {
      locationGroupId = undefined;
    }

    if (locationGroupId !== undefined && locationGroupId !== null) {
      // tslint:disable-next-line:max-line-length
      return this.http.get(Config.serviceUrl + `ml/BlockagePrediction/span?customerId=${customerId}&index=${index}&pageSize=${pageSize}&start=${startDate}&end=${endDate}&locationGroupId=${locationGroupId}`).map(res => {
        if (res === 204) {
          return [];
        }
        this.bPDetails = res;
        return this.bPDetails;
      });
    } else {
      // tslint:disable-next-line:max-line-length
      return this.http.get(Config.serviceUrl + `ml/BlockagePrediction/span?customerId=${customerId}&index=${index}&pageSize=${pageSize}&start=${startDate}&end=${endDate}`).map(res => {
        if (res === 204) {
          return [];
        }
        this.bPDetails = res;
        return this.bPDetails;
      });
    }
  }

  // get the tile count for blockage-prediction.
  getBlockagePredictionCount(customerId: number, startDate: any, endDate: any, locationGroupId?: number) {
    if (locationGroupId !== undefined && locationGroupId !== null && locationGroupId !== 0) {
      return this.http.get(Config.serviceUrl + `ml/BlockagePrediction/count?customerId=${customerId}
&LocationGroupId=${locationGroupId}&StartTime=${startDate}&EndTime=${endDate}`).map(res => {
          this.blockagePredictionCount = res.count;
          return this.blockagePredictionCount;
        });
    } else {
      return this.http.get(Config.serviceUrl + `ml/BlockagePrediction/count?customerId=${customerId}
&StartTime=${startDate}&EndTime=${endDate}`).map(res => {
          this.blockagePredictionCount = res.count;
          return this.blockagePredictionCount;
        });
    }
  }

}
