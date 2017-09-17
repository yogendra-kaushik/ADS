import { TestBed, async } from '@angular/core/testing';
import { Locations } from './locations';
import { GeographicLoc } from './geographic-loc';

describe('Locations', () => {
    it('create an instance', () => {
        let locations = new Locations();
        expect(locations).toBeDefined();
    });

    it('should return the correct properties', () => {
        let locations = new Locations();
        let geographicLoc = new GeographicLoc(34.65394121000001, -86.83981550859374, 10);
        locations.dataCollectTaskID = 0;
        locations.exportDataToFtp = true;
        locations.installationId = 11;
        locations.installationLoadCustom = false;
        locations.isActiveLocation = true;
        locations.locationId = 86;
        locations.locationName = 'P10';
        locations.locationType = 5;
        locations.publicationGroupID = 2;
        locations.wasCreatedFromImport = true;
        locations.installationType = 10;
        locations.customerID = 7;
        expect(locations.dataCollectTaskID).toBe(0);
        expect(locations.exportDataToFtp).toBe(true);
        expect(locations.installationId).toBe(11);
        expect(locations.installationLoadCustom).toBe(false);
        expect(locations.isActiveLocation).toBe(true);
        expect(locations.locationId).toBe(86);
        expect(locations.locationName).toBe('P10');
        expect(locations.locationType).toBe(5);
        expect(locations.publicationGroupID).toBe(2);
        expect(locations.wasCreatedFromImport).toBe(true);
        expect(locations.installationType).toBe(10);
        expect(locations.customerID).toBe(7);
    });
});
