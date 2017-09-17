export class MapView {
    id: Number;
    name: string;
    longitude: number;
    latitude: number;
    zoom: number;
    constructor(data: MapView) {
        if (data) {
            this.id = data.id;
            this.name = data.name;
            this.longitude = data.longitude;
            this.latitude = data.latitude;
            this.zoom = data.zoom;
        }
    }
}
