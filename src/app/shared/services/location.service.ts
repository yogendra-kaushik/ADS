import { Injectable, Inject, EventEmitter } from '@angular/core';
import { Config } from 'app/shared/services/config';
import { HttpClient } from 'app/shared/services/http-client';
import 'rxjs/add/operator/map';
import { AddLocation, SelectItem } from 'app/shared/models';

@Injectable()
export class LocationService {

  locationsChange: EventEmitter<number[]> = new EventEmitter<number[]>();
  locationChange: EventEmitter<number> = new EventEmitter<number>();
  private _locationId: number;
  private _locationIDs: number[];

  constructor( @Inject(HttpClient) public http: HttpClient) { }

  // getter and setter for location Id
  set locationId(locationId: number) {
      this._locationId = locationId;
      this.locationChange.emit(locationId);
  }

  get locationId(): number {
    return this._locationId;
  }

  set locationIDs(locationIDs: number[]) {
    this._locationIDs = locationIDs;
    this.locationsChange.emit(locationIDs);
  }

  get locationIDs(): number[] {
    return this._locationIDs;
  }

  addLocation(customerId: number, addLocation: AddLocation) {
    let res = this.http.post(Config.serviceUrl + `data/Locations?customerID=${customerId}`, addLocation);
    res.catch(error => {
      console.dir(error.json());
      return res;
    });
    return res;
  }

  public containsLocation(location: SelectItem, selectedLocations: SelectItem[]) {
    for (let i = 0; i < selectedLocations.length; i++) {
      if (selectedLocations[i].id === location.id) {
        return true;
      }
    }
    return false;
  }

}
