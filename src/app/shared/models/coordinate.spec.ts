import { TestBed, async } from '@angular/core/testing';
import { Coordinate } from './coordinate';

describe('Coordinate', () => {
    it('create an instance', () => {
        let coordinate = new Coordinate();
        expect(coordinate).toBeDefined();
    });

    it('should return the correct properties', () => {
        let coordinate = new Coordinate();
        coordinate.latitude = 34.65394121000001;
        coordinate.longitude = -86.83981550859374;
        coordinate.elevation = 11;
        expect(coordinate.latitude).toBe(34.65394121000001);
        expect(coordinate.longitude).toBe(-86.83981550859374);
        expect(coordinate.elevation).toBe(11);
    });
});
