import { MarkerLocation } from './marker-location';
import { KeyValue } from './key-value';
import { GeographicLoc } from './geographic-loc';

export class Locations {
    dataCollectTaskID: number;
    exportDataToFtp: boolean;
    geographicLoc: GeographicLoc;
    installationId: number;
    installationLoadCustom: boolean;
    isActiveLocation: boolean;
    lastCollectedDate: Date;
    locationId: number;
    locationName: string;
    locationType: number;
    publicationGroupID: number;
    rainGaugeAssignmentDate: Date;
    wasCreatedFromImport: boolean;
    installationType: number;
    customerID: number;
    series: string;
}

export class LocalLocation {
    locationId: number;
    locationName: string;
    isSelected: boolean;
}

export class LocalLocationGroup {
    customerID: number;
    locationGroupID: number;
    description: string;
    name: string;
    locations: number[];
}

