/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { CustomMap } from './custom.map.directive';
import { MapsAPILoader, NoOpMapsAPILoader, MouseEvent, GoogleMapsAPIWrapper } from 'angular2-google-maps/core';


describe('CustomMap', () => {
  let mockCustomMap;

  beforeEach(() => {
    mockCustomMap = jasmine.createSpyObj('mockCustomMap', ['openLocationDetails']);
    mockCustomMap.openLocationDetails.and.returnValue(true);
  });

  it('should create an instance', () => {
    let directive = new CustomMap(null);
    expect(directive).toBeDefined();
  });


  it('should test openLocationDetails', () => {
    let directive = new CustomMap(null);
    let result = false;
    let myFunction = {
      emit: function () {
        result = true;
      }
    };
    directive.openLocationDetails(null, myFunction);
    expect(result).toBeTruthy();
  });


  it('should test openLocations', () => {
    let directive = new CustomMap(null);
    let result = false;
    let myFunction = {
      emit: function () {
        result = true;
      }
    };
    directive.openLocations(null, myFunction);
    expect(result).toBeTruthy();
  });


  it('should test createMarkers', () => {
    let result = false;

    let mockGoogleMap = jasmine.createSpyObj('mockAdalService', ['getNativeMap']);

    mockGoogleMap.getNativeMap.and.returnValue(new Promise((resolve) => {
      result = true;
    }));
    let directive = new CustomMap(mockGoogleMap);

    directive.createMarkers(null, null, null, null);
    expect(result).toBeTruthy();
  });

});
