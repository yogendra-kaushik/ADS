export class ScatterData {
    title: string;
    subTitle: string;
    start: Date;
    end: Date;
    xAxis: Axis;
    yAxis: Axis;
    data: EntityData[];

    constructor() {
    }
}

class Axis {
    minimum: number;
    maximum: number;
    label: string;
    constructor() {
    }
}

class EntityData {
    dateTime: Date;
    x: number;
    y: number;

    constructor() {
    }
}

