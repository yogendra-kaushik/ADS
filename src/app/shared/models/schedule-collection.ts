export class ScheduleCollection {
    scheduleId: number;
    scheduleDescription: string;
    name: string;
    frequency: number;
    alarmingFrequency: number;
    daysToCollect: string[];
    locations: number[];
    collectionDays: string[];

    constructor() {
    }
}
