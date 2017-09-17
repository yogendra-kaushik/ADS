import { TestBed, async } from '@angular/core/testing';
import { GeographicLoc } from './geographic-loc';

describe('geographicLoc', () => {
    it('create an instance', () => {
        let geographicLoc = new GeographicLoc(34.65394121000001, -86.83981550859374, 10);
        expect(geographicLoc).toBeDefined();
    });
    it('should return the correct properties', () => {
        let geographicLoc = new GeographicLoc(34.65394121000001, -86.83981550859374, 10);
        geographicLoc.latitude = 34.65394121000001;
        geographicLoc.longitude = -86.83981550859374;
        geographicLoc.elevation = 10;

        expect(geographicLoc.latitude).toBe(34.65394121000001);
        expect(geographicLoc.longitude).toBe(-86.83981550859374);
        expect(geographicLoc.elevation).toBe(10);
    });
});
