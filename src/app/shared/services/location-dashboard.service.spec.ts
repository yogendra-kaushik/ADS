/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { HttpModule, ResponseOptions, Response, Http, BaseRequestOptions, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs';

import { Config } from './config';
import { HttpClient } from './http-client';
import { AuthService } from './auth.service';
import { AdalService } from 'ng2-adal/services/adal.service';
import { LocationDashboardService } from './location-dashboard.service';
import { Locations } from '../../shared/models/locations';
import { MapView } from '../../shared/models/map-view';
import { MapType } from '../../shared/models/map-type';
import { MaterialModule } from '@angular/material';
import { CustomerService } from 'app/shared/services';

describe('LocationDashboardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, MaterialModule],
      // tslint:disable-next-line:max-line-length
      providers: [LocationDashboardService, CustomerService, HttpClient, AuthService, AdalService,
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

  describe('getLocations()', () => {

    it('should create the instance...', inject([LocationDashboardService], (service: LocationDashboardService) => {
      expect(service).toBeTruthy();
    }));

    it('should return an Observable<Array<Locations>',
      inject([LocationDashboardService, MockBackend], (locationDashboardService, mockBackend) => {
        const mockResponse = [{
          'dataCollectTaskID': 0,
          'exportDataToFtp': true,
          'geographicLoc': {
            'elevation': 0.0,
            'latitude': 34.76217075,
            'longitude': -86.75731659
          },
          'installationId': 19482,
          'installationLoadCustom': false,
          'isActiveLocation': false,
          'lastCollectedDate': '2015-05-27T06:40:01',
          'locationId': 1,
          'locationName': '3GEM_31337',
          'locationType': 1,
          'mapLabel': '3GEM_31337',
          'publicationGroupID': 0,
          'wasCreatedFromImport': true,
          'installationType': 0,
          'customerID': 796
        }, {
          'dataCollectTaskID': 0,
          'exportDataToFtp': true,
          'geographicLoc': {
            'elevation': 0.0,
            'latitude': 0.0,
            'longitude': 0.0
          },
          'installationId': 19483,
          'installationLoadCustom': false,
          'isActiveLocation': false,
          'lastCollectedDate': '2016-10-05T03:15:01',
          'locationId': 2,
          'locationName': 'BC10',
          'locationType': 1,
          'publicationGroupID': 0,
          'wasCreatedFromImport': true,
          'installationType': 0,
          'customerID': 796
        }, {
          'dataCollectTaskID': 0,
          'exportDataToFtp': true,
          'geographicLoc': {
            'elevation': 0.0,
            'latitude': 34.70320157,
            'longitude': -86.68693542
          },
          'installationId': 19484,
          'installationLoadCustom': false,
          'isActiveLocation': false,
          'lastCollectedDate': '2016-07-15T19:00:01',
          'locationId': 3,
          'locationName': 'Dynamic_50499',
          'locationType': 1,
          'publicationGroupID': 0,
          'wasCreatedFromImport': true,
          'installationType': 0,
          'customerID': 796
        }, {
          'dataCollectTaskID': 0,
          'exportDataToFtp': false,
          'geographicLoc': {
            'elevation': 0.0,
            'latitude': 0.0,
            'longitude': 0.0
          },
          'installationId': 19485,
          'installationLoadCustom': false,
          'isActiveLocation': false,
          'lastCollectedDate': '2016-07-15T19:00:01',
          'locationId': 4,
          'locationName': 'Dynamic_50499(2)',
          'locationType': 1,
          'publicationGroupID': 0,
          'wasCreatedFromImport': true,
          'installationType': 0,
          'customerID': 796
        }, {
          'dataCollectTaskID': 0,
          'exportDataToFtp': true,
          'geographicLoc': {
            'elevation': 0.0,
            'latitude': 34.75850404,
            'longitude': -86.61792755
          },
          'installationId': 19486,
          'installationLoadCustom': false,
          'isActiveLocation': false,
          'lastCollectedDate': '2016-06-14T09:00:01',
          'locationId': 5,
          'locationName': 'EMUX_FH21900',
          'locationType': 1,
          'mapLabel': 'EMUX_FH21900',
          'publicationGroupID': 0,
          'wasCreatedFromImport': true,
          'installationType': 0,
          'customerID': 796
        }, {
          'dataCollectTaskID': 0,
          'exportDataToFtp': false,
          'geographicLoc': {
            'elevation': 0.0,
            'latitude': 34.74773989,
            'longitude': -86.60762787
          },
          'installationId': 19487,
          'installationLoadCustom': false,
          'isActiveLocation': false,
          'lastCollectedDate': '2016-06-14T09:00:01',
          'locationId': 6,
          'locationName': 'EMUX_FH21900(2)',
          'locationType': 1,
          'publicationGroupID': 0,
          'wasCreatedFromImport': true,
          'installationType': 0,
          'customerID': 796
        }, {
          'dataCollectTaskID': 0,
          'exportDataToFtp': false,
          'geographicLoc': {
            'elevation': 0.0,
            'latitude': 34.77175985,
            'longitude': -86.54685974
          },
          'installationId': 19488,
          'installationLoadCustom': false,
          'isActiveLocation': false,
          'lastCollectedDate': '2016-10-05T02:20:01',
          'locationId': 7,
          'locationName': 'FST-IM_50172',
          'locationType': 1,
          'publicationGroupID': 0,
          'wasCreatedFromImport': true,
          'installationType': 0,
          'customerID': 796
        }, {
          'dataCollectTaskID': 0,
          'exportDataToFtp': false,
          'geographicLoc': {
            'elevation': 0.0,
            'latitude': 34.73537179,
            'longitude': -86.51424408
          },
          'installationId': 19489,
          'installationLoadCustom': false,
          'isActiveLocation': false,
          'lastCollectedDate': '2016-10-05T02:20:01',
          'locationId': 8,
          'locationName': 'FST-IM_50172(2)',
          'locationType': 1,
          'publicationGroupID': 0,
          'wasCreatedFromImport': true,
          'installationType': 0,
          'customerID': 796
        }, {
          'dataCollectTaskID': 0,
          'exportDataToFtp': true,
          'geographicLoc': {
            'elevation': 0.0,
            'latitude': 34.70400951,
            'longitude': -86.54346943
          },
          'installationId': 19490,
          'installationLoadCustom': false,
          'isActiveLocation': false,
          'lastCollectedDate': '2016-10-03T08:00:01',
          'locationId': 9,
          'locationName': 'Grenada_Triton',
          'locationType': 1,
          'mapLabel': 'Grenada_Triton',
          'publicationGroupID': 0,
          'rainGaugeAssignmentDate': '2015-04-17T10:46:07.163',
          'wasCreatedFromImport': true,
          'installationType': 0,
          'customerID': 796
        }, {
          'dataCollectTaskID': 0,
          'exportDataToFtp': true,
          'geographicLoc': {
            'elevation': 0.0,
            'latitude': 34.71458675,
            'longitude': -86.68101311
          },
          'installationId': 19491,
          'installationLoadCustom': false,
          'isActiveLocation': false,
          'lastCollectedDate': '2016-07-15T19:00:01',
          'locationDesc': 'Desc Properties tab',
          'locationId': 10,
          'locationName': 'HSV1T',
          'locationType': 1,
          'mapLabel': 'HSV1T',
          'publicationGroupID': 0,
          'rainGaugeAssignmentDate': '2016-05-20T12:22:43.37',
          'wasCreatedFromImport': true,
          'installationType': 0,
          'customerID': 796
        }];
        mockBackend.connections.subscribe((connection) => {
          connection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockResponse)
          })));
        });
        // make the fake call to get locations.
        locationDashboardService.getLocations().subscribe((locations) => {
          // Validate the length of response.
          expect(locations.length).toBe(10);
          expect(locations[0].dataCollectTaskID).toEqual(0);
          expect(locations[0].exportDataToFtp).toEqual(true);
          expect(locations[0].geographicLoc.elevation).toEqual(0.0);
          expect(locations[0].geographicLoc.latitude).toEqual(34.76217075);
          expect(locations[0].geographicLoc.longitude).toEqual(-86.75731659);
          expect(locations[0].installationId).toEqual(19482);
          expect(locations[0].installationLoadCustom).toEqual(false);
          expect(locations[0].isActiveLocation).toEqual(false);
          expect(locations[0].lastCollectedDate).toEqual('2015-05-27T06:40:01');
          expect(locations[0].locationId).toEqual(1);
          expect(locations[0].locationName).toEqual('3GEM_31337');
          expect(locations[0].locationType).toEqual(1);
          expect(locations[0].mapLabel).toEqual('3GEM_31337');
          expect(locations[0].publicationGroupID).toEqual(0);
          expect(locations[0].wasCreatedFromImport).toEqual(true);
          expect(locations[0].installationType).toEqual(0);
          expect(locations[0].customerID).toEqual(796);
        });
      }));
  });

  describe('getMapViews()', () => {
    it('test getMapViews',
      inject([LocationDashboardService, MockBackend], (locationDashboardService, mockBackend) => {
        const mockResponse = [{
          'id': 1,
          'name': 'View1',
          'longitude': 34.76,
          'latitude': -86.75,
          'zoom': 5
        },
        {
          'id': 2,
          'name': 'View2',
          'longitude': 20.23,
          'latitude': -10.34,
          'zoom': 5
        }];
        mockBackend.connections.subscribe((connection) => {
          connection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockResponse)
          })));
        });
        // make the fake call to get locations.
        locationDashboardService.getMapViews().subscribe((result) => {
          // Validate the length of response.
          let resultMapViews = <MapView[]>result;
          expect(resultMapViews.length).toEqual(2);
          expect(resultMapViews[0].id).toEqual(1);
          expect(resultMapViews[0].name).toEqual('View1');
          expect(resultMapViews[0].longitude).toEqual(34.76);
          expect(resultMapViews[0].latitude).toEqual(-86.75);
          expect(resultMapViews[0].zoom).toEqual(5);
        });
      }));
  });
  describe('getMapTypes()', () => {
    it('test getMapTypes',
      inject([LocationDashboardService, MockBackend], (locationDashboardService, mockBackend) => {
        const mockResponse = [{
          'id': 1,
          'name': 'Satellite',
          'styles': [{
            'featureType': 'landscape.natural.terrain',
            'elementType': 'all',
            'stylers':
            [
              { 'color': '#FF00FF' },
              { 'weight': 1 }
            ]
          }]
        },
        {
          'id': 2,
          'name': 'Map',
          'styles': [{
            'featureType': 'landscape.natural',
            'elementType': 'all',
            'stylers':
            [
              { 'weight': 1 }
            ]
          }]
        }];
        mockBackend.connections.subscribe((connection) => {
          connection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockResponse)
          })));
        });
        // make the fake call to get map types.
        locationDashboardService.getMapViews().subscribe((result) => {
          // Validate the length of response.
          let resultMapTypes = <MapType[]>result;
          expect(resultMapTypes.length).toEqual(2);
          expect(resultMapTypes[0].id).toEqual(1);
          expect(resultMapTypes[0].name).toEqual('Satellite');
          expect(resultMapTypes[0].styles[0].featureType).toEqual('landscape.natural.terrain');
          expect(resultMapTypes[0].styles[0].elementType).toEqual('all');
          expect(resultMapTypes[0].styles[0].stylers[0].color).toEqual('#FF00FF');
          expect(resultMapTypes[0].styles[0].stylers[1].weight).toEqual(1);
        });
      }));
  });
});
