import { Injectable, Inject, EventEmitter } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { HttpClient } from './http-client';
import { Config } from './config';
import { LocationGroup } from '../models/location-group';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class LocationGroupService {
  locationGroupChange: EventEmitter<number> = new EventEmitter<number>();
  private _locationGroupID: number;
  constructor( @Inject(HttpClient) public http: HttpClient) { }

  // getter and setter for locationGroupId
  set locationGroupID(locationGroupID: number) {
    if (this._locationGroupID !== locationGroupID) {
      this._locationGroupID = locationGroupID;
      this.locationGroupChange.emit(locationGroupID);
    }
  }

  get locationGroupID(): number {
    return this._locationGroupID;
  }

  // Add & update location Group
  postLocationGroup(customerId: number, locationGroup: LocationGroup) {
    let postUrl = Config.getUrl(Config.urls.locationGroup.postUrl);

    let res = (locationGroup.locationGroupID === undefined || locationGroup.locationGroupID === null
      || locationGroup.locationGroupID === 0 ?
      // below is api url for add location group
      this.http.post(postUrl, locationGroup)
      // below is api url for update location group
      : this.http.put(postUrl, locationGroup));

    res.catch(error => {
      console.dir(error.json());
      return res;
    });
    return res;
  }

  getLocationGroups(customerId: number): Observable<any> {
    let getURL = Config.getUrl(Config.urls.locationGroup.getUrl + '?customerId=' + customerId);
    return this.http.get(getURL)
      .map(response => <LocationGroup>response);
  }

  deleteLocationGroups(locationGroupID: number): Observable<any> {
    return this.http.delete(
      Config.getUrl(Config.urls.locationGroup.deleteUrl + locationGroupID))
      .map(response => <LocationGroup>response);
  }

  getLocationGroupDetails(customerId: number, locationGroupId: number): Observable<any> {
    let getURL = Config.getUrl(Config.urls.locationGroup.getUrl + '/' + locationGroupId + '?customerId=' + customerId);
    return this.http.get(getURL)
      .map(response => <LocationGroup>response);
  }

}
