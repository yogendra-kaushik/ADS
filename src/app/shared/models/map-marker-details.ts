import { MarkerLocation } from "./marker-location";
import { KeyValue } from "./key-value";
import { Coordinate } from "./coordinate";
export class MapMarkerDetails {
    serialModelMP: string;
    isActive: boolean;
    locationDesc: string;
    address1: string;
    coordinate: Coordinate;
    constructor() {
        this.coordinate = new Coordinate();
    }
}