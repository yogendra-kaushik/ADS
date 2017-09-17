import { Coordinate } from "./coordinate";

export class SaveView {
    name: string;
    description: string;
    coordinate:Coordinate;
    zoom: number;
    isDefault: boolean;
    isViewUpdate: boolean;
    id: number;
    viewTitle: string;
    viewButtonTitle: string;

    constructor(){
        this.coordinate = new Coordinate();
    }
}
