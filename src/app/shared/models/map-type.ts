import { MapTypeStyle } from 'angular2-google-maps/core';

export class MapType {
    id: Number;
    name: string;
    styles: MapTypeStyle[] = [];
    constructor(data: MapType){
        if(data){
            this.id = data.id;
            this.name = data.name;
            this.styles = data.styles;
        }
    }
}
