export class ActiveAlarm {

    id: number;
    state: boolean;
    type: string;
    locationID: number;
    location: string;
    timestamp: Date;
    acknowledgeBy: string;
    acknowledgeTime: Date;
    clearBy: string;
    clearTime: Date;

    constructor() {

    }

}
