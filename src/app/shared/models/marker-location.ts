export class MarkerLocation {
    id: number;
    title: string;
    locationName: string;
    locationAlias: string;
    icon: string;
    //byte[] image { get; set; }
    imageWidth: number;
    listImagePath: string;
    mapImagePath: string;
    selectedImagePath: string;
    invalidCoordsPath: string;
    status: number;
    coords: number[]
    desc: string;
    type: number;
    itype: number;
    weight: string;
    isActive: boolean;
    isCollecting: boolean;
    lowBattery: boolean;
    isAlarming: boolean;
    isAcknowledged: boolean;
    isManualCollect: boolean;

    constructor() {

    }
}
