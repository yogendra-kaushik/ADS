import { MarkerLocation } from './marker-location';
import { KeyValue } from './key-value';
import { Coordinate } from './coordinate';

export class LocationDetails {
    series: string;
    serialNumber: string;
    isActive: boolean;
    description: string;
    manholeAddress: string;
    coordinate: Coordinate;
    locationID: number;
    locationName: string;
    ipaddress: string;

    constructor() {
        this.coordinate = new Coordinate();
    }
}