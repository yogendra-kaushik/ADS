import { EventEmitter, Injectable, Inject } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import { HttpClient } from "./http-client";
import { Config } from "./config";

import { SebmGoogleMap } from 'angular2-google-maps/core';
import { Observable } from 'rxjs/Observable';
import { SaveView } from '../models/save-view'
import { LocationDetails } from '../models/location-details'

@Injectable()
export class MapService {
    constructor( @Inject(HttpClient) public http: HttpClient) {

    }

    setLocation(longitute: Number, latitude: Number, zoom: number) {

    }

    addMap(customerId: number, saveView: SaveView) {
        // return this.http.post(Config.apiUrl + 'customers/' + customerId + '/maps', saveView);
        return true;
    }

    getMarkerLocationDetails(locationId: number, customerId: number) {
        return this.http.get(Config.urls.markerLocationDetails + customerId + '/' + locationId);
    }

    saveMarkerLocationDetailsForGeneral(locationId: number, customerId: number, locationDetails: LocationDetails) {
        return true;
        // here we need to put logic for saving changed cordinates
    }
}