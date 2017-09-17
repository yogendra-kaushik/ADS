export class ViewData {
    title: string;
    subTitle: string;
    start: Date;
    end: Date;
    displayGroups: DisplayGroup[];

    constructor() {
    }
}

class DisplayGroup {
    id: number;
    axis: Object;
    entityInformation: EntityInformation[];
    entityData: EntityData[];

    constructor() {
    }
}

class EntityData {
    ts: Date;
    E: Object;

    constructor() {
    }
}

class EntityInformation {
    id: number;
    name: string;
    color: number;

    constructor() {
    }
}
