/* tslint:disable:no-unused-variable */
/*
import { TestBed, async, inject } from '@angular/core/testing';
import { MapService } from './map.service';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { HttpModule, ResponseOptions, Response, Http, BaseRequestOptions, RequestMethod } from '@angular/http';
import { HttpClient } from './http-client';
import { AuthService } from './auth.service';
import { AdalService } from 'ng2-adal/services/adal.service';
import { LocationDetails } from '../models/location-details';
import { Coordinate } from '../../../app/shared/models/coordinate';

describe('MapService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MapService, HttpClient, AuthService, AdalService,
                {
                    provide: Http, HttpClient,
                    useFactory: (mockBackend, options) => {
                        return new Http(mockBackend, options);
                    },
                    deps: [MockBackend, BaseRequestOptions]
                },
                MockBackend,
                BaseRequestOptions
            ]
        });
    });

    it('should test service object to be defined', inject([MapService], (mapService: MapService) => {
        expect(mapService).toBeDefined();
    }));

    it('should test function getMarkerLocationDetails', inject([MapService, MockBackend],
        (mapService: MapService, mockBackend) => {
            let coordinate = new Coordinate();
            coordinate.latitude = -5;
            coordinate.longitude = 15;
            const mockResponse = {
                'isActive': true,
                'locationID': 14,
                'manholeAddress': 'TestAddress',
                'locationName': 'TestName',
                'series': 'TestSeries',
                'serialNumber': 'TestSerialNumber',
                'coordinate': coordinate
            };
            mockBackend.connections.subscribe((connection) => {
                connection.mockRespond(new Response(new ResponseOptions({
                    body: JSON.stringify(mockResponse)
                })));
            });

            mapService.getMarkerLocationDetails(1, 2).subscribe((result) => {
                let resultMapTypes = <LocationDetails>result;
                expect(resultMapTypes.isActive).toBeTruthy();
                expect(resultMapTypes.locationID).toBe(14);
                expect(resultMapTypes.manholeAddress).toBe('TestAddress');
                expect(resultMapTypes.locationName).toBe('TestName');
                expect(resultMapTypes.series).toBe('TestSeries');
                expect(resultMapTypes.serialNumber).toBe('TestSerialNumber');
                expect(resultMapTypes.coordinate.latitude).toBe(-5);
                expect(resultMapTypes.coordinate.longitude).toBe(15);
            });
        }));
});
*/