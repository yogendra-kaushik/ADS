export class GeographicLoc {
    elevation: number;
    latitude: number;
    longitude: number;

    constructor(elevation: number, latitude: number, longitude: number) {
        this.elevation = elevation;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}
