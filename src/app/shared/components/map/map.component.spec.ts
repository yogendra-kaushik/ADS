/* tslint:disable:no-unused-variable */

import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpModule, ResponseOptions, Response, Http, BaseRequestOptions, RequestMethod } from '@angular/http';
import { By } from '@angular/platform-browser';
import { DebugElement, ChangeDetectorRef, NgZone } from '@angular/core';
import { MapComponent } from './map.component';
import { MapService } from '../../services/map.service';
import { CustomerService } from '../../services/customer.service';
import { Config } from '../../services/config';
import { Locations } from '../../models/locations';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { HttpClient } from '../../services/http-client';
import { AuthService } from '../../services/auth.service';
import { AdalService } from 'ng2-adal/services/adal.service';
import { Observable } from 'rxjs';
import { LocationService } from 'app/shared/services/location.service';
import { LocationDashboardService } from 'app/shared/services';

class MockMapService extends MapService {
  getMarkerLocationDetails(data: any) {
    return Observable.of(
      {
        'series': '4000',
        'serialNumber': '144',
        'isActive': false,
        'description': '',
        'manholeAddress': '',
        'coordinates': '33.72626495, -84.53149414',
        'locationID': 205,
        'locationName': 'UC23'
      }
    );
  }
}

class DetectorRef extends ChangeDetectorRef {
  markForCheck(): void {
    throw new Error('Method not implemented.');
  }
  detach(): void {
    throw new Error('Method not implemented.');
  }
  detectChanges(): void {
    throw new Error('Method not implemented.');
  }
  checkNoChanges(): void {
    throw new Error('Method not implemented.');
  }
  reattach(): void {
    throw new Error('Method not implemented.');
  }


}

describe('MapComponent', () => {
  let mapService;
  let permissionService;
  let customerService;
  let latitude = 0.000000001;
  let longitude = 0.000000001;
  let showLegend = false;
  let component;
  let hangeDetectorRef;
  let mockMapService = new MockMapService(null);
  let zone: NgZone;
  let locationService;

  beforeEach(function () {
    customerService = new CustomerService(null);
    locationService = new LocationService(null);
    hangeDetectorRef = new DetectorRef();
    zone = new NgZone({ enableLongStackTrace: false });
    component = new MapComponent(customerService, mockMapService, hangeDetectorRef, zone, null, locationService, null);
    let mockMapComponent;
    spyOn(component, 'reCenter');

    component.mapTypes = [
      {
        'id': 1, 'name': 'Satellite', 'styles': [{
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
        'id': 2, 'name': 'Map', 'styles': [{
          'featureType': 'landscape.natural',
          'elementType': 'all',
          'stylers':
          [
            { 'weight': 1 }
          ]
        }]
      }];

    component.mapViews = [{
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

    component.locations = [{
      'dataCollectTaskID': 0,
      'exportDataToFtp': true,
      'geographicLoc': {
        'elevation': 0,
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
      'installationType': 0
    }];

    TestBed.configureTestingModule({
      imports: [HttpModule],
      // tslint:disable-next-line:max-line-length
      providers: [HttpClient, AuthService, AdalService,
        {
          provide: Http, HttpClient, MapService,
          userClass: mockMapService,
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

  it('should create the MapComponent', () => {
    let component = new MapComponent(customerService, mapService, hangeDetectorRef, zone, null, locationService, null);
    expect(component).toBeTruthy();
  });

  it('should validate object of map component', () => {
    spyOn(component, 'drawMarkers');
    expect(component).toBeDefined();
  });

  it('should validate object ngOnInit', () => {
    let component = new MapComponent(customerService, mapService, hangeDetectorRef, zone, null, locationService, null);
    expect(component.ngOnInit).toBeDefined();
  });

  it('should validate recenter method of map component', () => {
    component.mapViewModel.latitude = 0.000000002;
    component.mapViewModel.longitude = 0.000000002;
    component.reCenter();
    spyOn(component, 'drawMarkers');
    expect(component.mapViewModel.latitude).toBe(0.000000002);
    expect(component.mapViewModel.longitude).toBe(0.000000002);
  });

  it('should validate recenter method of toggleLegend', () => {
    let component = new MapComponent(customerService, mapService, hangeDetectorRef, zone, null, locationService, null);
    component.showLegend = true;
    component.toggleLegend();
    expect(component.showLegend).toBe(false);
  });

  it('should validate drawMarkers method of map component', () => {
    let locations: Array<Locations>;
    this.locations = [{
      'dataCollectTaskID': 0,
      'exportDataToFtp': false,
      'geographicLoc': {
        'elevation': 0.0,
        'latitude': 33.55550003,
        'longitude': -84.46941375
      },
      'installationId': 6418,
      'installationLoadCustom': false,
      'isActiveLocation': false,
      'lastCollectedDate': '2016-10-03T01:30:01',
      'locationId': 3,
      'locationName': 'ADPS',
      'locationType': 1,
      'publicationGroupID': 0,
      'rainGaugeAssignmentDate': '2016-09-27T11:24:49.14',
      'wasCreatedFromImport': true,
      'installationType': 0,
      'customerID': 63
    }, {
      'dataCollectTaskID': 0,
      'exportDataToFtp': false,
      'geographicLoc': {
        'elevation': 0.0,
        'latitude': 33.67601013,
        'longitude': -84.63014984
      },
      'installationId': 2486,
      'installationLoadCustom': false,
      'isActiveLocation': false,
      'lastCollectedDate': '2016-10-03T01:30:01',
      'locationId': 4,
      'locationName': 'CC01',
      'locationType': 1,
      'publicationGroupID': 0,
      'rainGaugeAssignmentDate': '2016-09-27T11:24:49.14',
      'wasCreatedFromImport': true,
      'installationType': 0,
      'customerID': 63
    }, {
      'dataCollectTaskID': 0,
      'exportDataToFtp': false,
      'geographicLoc': {
        'elevation': 0.0,
        'latitude': 33.68166351,
        'longitude': -84.57183837
      },
      'installationId': 2487,
      'installationLoadCustom': false,
      'isActiveLocation': false,
      'lastCollectedDate': '2016-09-20T01:30:01',
      'locationId': 5,
      'locationName': 'CC01A',
      'locationType': 1,
      'publicationGroupID': 0,
      'rainGaugeAssignmentDate': '2016-09-27T11:24:49.157',
      'wasCreatedFromImport': true,
      'installationType': 0,
      'customerID': 63
    }];
    component.markers = this.locations;
    component.mapViewModel.latitude = this.locations[0].geographicLoc.latitude;
    component.mapViewModel.longitude = this.locations[0].geographicLoc.longitude;
    spyOn(component, 'drawMarkers');
    expect(component.drawMarkers).toBeDefined();
    expect(component.mapViewModel.latitude).toBe(33.55550003);
    expect(component.mapViewModel.longitude).toBe(-84.46941375);
  });

  it('should validate ngOnInit method of map component', () => {
    spyOn(component, 'drawMarkers');
    expect(component.ngOnInit).toBeDefined();
  });

  it('should validate ngOnChanges method of map component', () => {
    spyOn(component, 'drawMarkers');
    component.selectedMapTypeId = 1;
    component.ngOnChanges();
    expect(component.mapTypeModel.id).toBe(1);
    expect(component.mapTypeModel.name).toBe('Satellite');
  });

  it('should validate changeMapView method of map component', () => {
    spyOn(component, 'drawMarkers');
    component.selectedMapViewId = 1;
    component.changeMapView();
    expect(component.mapViewModel.zoom).toBe(5);
  });

  it('should validate changeMapType method of map component', () => {
    spyOn(component, 'drawMarkers');
    component.selectedMapTypeId = 1;
    component.changeMapType();
    expect(component.mapTypeModel.id).toBe(1);
    expect(component.mapTypeModel.name).toBe('Satellite');
  });

  it('should validate drawMarkers of map component', () => {
    component.drawLocationList = [{
      geographicLoc: {
        latitude: 34.76217075,
        longitude: -86.75731659
      }
    }];
    component.drawMarkers();
    expect(component.mapViewModel.latitude).toBe(34.76217075);
    expect(component.mapViewModel.longitude).toBe(-86.75731659);
  });

  it('should validate toggleLegend method with false condition of map component', () => {
    component.showLegend = true;
    component.toggleLegend();
    expect(component.showLegend).toBeFalsy();
  });

  it('should validate getMarkerLocations of map component', () => {
    component.getMarkerLocations(component.locations);
    expect(component.clusterLocations[0].exportDataToFtp).toBeTruthy();
    expect(component.clusterLocations[0].installationId).toBeTruthy(19482);
    expect(component.clusterLocations[0].installationLoadCustom).toBeFalsy();
    expect(component.clusterLocations[0].locationId).toBe(1);
    expect(component.showLocationDetail).toBeTruthy();
    expect(component.showLocations).toBeFalsy();
  });

  it('should validate getMarkerLocationDetails of map component',
    inject([MockBackend], (mockBackend) => {
      component.getMarkerLocationDetails(component.locations);

      expect(component.locationDetails.series).toBe('4000');
      expect(component.locationDetails.serialNumber).toBe('144');
      expect(component.locationDetails.isActive).toBe(false);
      expect(component.locationDetails.description).toBe('');
      expect(component.locationDetails.manholeAddress).toBe('');
      expect(component.locationDetails.coordinate.latitude).toBe(33.72626495);
      expect(component.locationDetails.coordinate.longitude).toBe(-84.53149414);
      expect(component.locationDetails.locationID).toBe(205);
      expect(component.locationDetails.locationName).toBe('UC23');
      expect(component.showLocationDetail).toBeFalsy();
    }));

  it('should validate closeMapLocationDetailPopup of map component', () => {
    component.closeMapLocationDetailPopup(true);
    expect(component.showLocationDetail).toBeTruthy();
  });

  it('should validate getMarkerLocations of map component', () => {
    component.getMarkerLocations(component.locations);
    expect(component.clusterLocations[0].exportDataToFtp).toBeTruthy();
    expect(component.clusterLocations[0].installationId).toBeTruthy(19482);
    expect(component.clusterLocations[0].installationLoadCustom).toBeFalsy();
    expect(component.clusterLocations[0].locationId).toBe(1);
    expect(component.showLocationDetail).toBeTruthy();
    expect(component.showLocations).toBeFalsy();
    expect(component.clusterLocations).toBeTruthy();
    expect(component.showLocationDetail).toBeTruthy();
    expect(component.showLocations).toBeFalsy();
  });

  it('should validate closeMapLocationsPopup of map component', () => {
    component.closeMapLocationsPopup(true);
    expect(component.showLocations).toBeTruthy();
  });

  it('should validate openLocationDetailsPopUp of map component', () => {
    spyOn(component, 'getMarkerLocationDetails');
    component.openLocationDetailsPopUp(component.locations);
    expect(component.showLocations).toBeTruthy();
  });

});
