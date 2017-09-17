/* tslint:disable:no-unused-variable */

import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { By, BrowserModule } from '@angular/platform-browser';
import { DebugElement, ElementRef, ChangeDetectorRef, Injectable } from '@angular/core';
import { LocationDashboardService } from '../shared/services/location-dashboard.service';
import { LocationDashboardComponent } from './location-dashboard.component';
import { CustomerService } from '../shared/services/customer.service';
import { Config } from '../shared/services/config';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { ResponseOptions, BaseRequestOptions, Http } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { MaterialModule, MdDialog } from '@angular/material';
import { HttpClient } from 'app/shared/services/http-client';
import { AuthService } from 'app/shared/services/auth.service';
import { AdalService } from 'ng2-adal/services/adal.service';
import { SharedModule } from 'app/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable } from 'rxjs/Observable';
import { BatteryStatusWidgetComponent } from 'app/pages/battery-status-widget/battery-status-widget.component';
import { ChartModule } from 'angular2-highcharts';
import { SearchLocationNamePipe } from 'app/shared/pipes/search-locationname-pipe';
import { AppModule } from 'app';
import { APP_BASE_HREF } from '@angular/common';
import { LocationGroupService } from 'app/shared/services/location-group.service';
import { BatteryStatusService } from '../shared/services/battery-status.service';
import { AutoScrubSummaryService } from '../shared/services/auto-scrub-summary.service';
import { DateutilService } from '../shared/services/dateutil.service';
import { MdSnackBar } from '@angular/material';
import { ScheduleCollectionService } from '../shared/services/schedule-collection.service';
import { AlarmService } from 'app/shared/services/alarm.service';
import { BlockagePredictionService } from 'app/shared/services/blockage-prediction.service';
import { LocationService } from 'app/shared/services/location.service';
import { PreLoaderService } from 'app/shared/services/pre-loader.service';


describe('LocationDashboardComponent', () => {
  let locationDashboardService;
  let customerService;
  let locationGroupService;
  let batteryStatusService;
  let autoScrubSummaryService;
  let blockagePredictionService;
  let alarmService;
  let _snackBar;
  let dateutilService;
  let statusGetMapViews = false;
  let statusGetMapTypes = false;
  let statusGetLocations = false;
  let fixture: ComponentFixture<LocationDashboardComponent>;
  let mdDialog: MdDialog;
  let cdr: ChangeDetectorRef;
  let scheduleCollectionService: ScheduleCollectionService;
  let el: ElementRef;
  let locationService: LocationService;
  let preLoaderService: PreLoaderService;

  beforeEach(function () {
    locationDashboardService = new LocationDashboardService(null, null);
    customerService = new CustomerService(null);
    locationService = new LocationService(null);
    locationGroupService = new LocationGroupService(null);
    batteryStatusService = new BatteryStatusService(null, null);
    autoScrubSummaryService = new AutoScrubSummaryService(null);
    dateutilService = new DateutilService();
    scheduleCollectionService = new ScheduleCollectionService(null);
    blockagePredictionService = new BlockagePredictionService(null);
    alarmService = new AlarmService(null);
    mdDialog = new MdDialog(null, null, null, null);
    preLoaderService = new PreLoaderService();
    let nativeElement = {
      'querySelectorAll': function () {
      }
    };
    el = new ElementRef(nativeElement);


    spyOn(locationDashboardService, 'getMapViews').and.returnValue({
      subscribe: (result) => {
        statusGetMapViews = true;
      }
    });

    spyOn(locationDashboardService, 'getMapTypes').and.returnValue({
      subscribe: (result) => {
        statusGetMapTypes = true;
      }
    });

    spyOn(blockagePredictionService, 'getBlockagePredictionCount').and.returnValue(Observable.of(11));

    spyOn(blockagePredictionService, 'getBlockagePredictionWidget').and.returnValue(Observable.of({}));

    spyOn(batteryStatusService, 'getBatteryStatus').and.returnValue(Observable.of(
      { 'listBatteries': [] })
    );

    spyOn(batteryStatusService, 'getBatteryStatusTotal').and.returnValue(Observable.of(
      { 'customerID': 63, 'criticalBatteryTotal': 4, 'lowBatteryTotal': 32 })
    );

    spyOn(autoScrubSummaryService, 'getAutoDetectCount').and.returnValue(Observable.of(
      13
    ));

    spyOn(autoScrubSummaryService, 'getAutoScrubSummary').and.returnValue(Observable.of(
      [])
    );

    spyOn(scheduleCollectionService, 'getFailedCollection').and.returnValue(Observable.of(
      {
        'failedcollections': 14
      })
    );

    spyOn(scheduleCollectionService, 'getUpcomingCollection').and.returnValue(Observable.of(
      {
        'collectionstart': new Date()
      })
    );

    spyOn(scheduleCollectionService, 'getCollectionHistory').and.returnValue(Observable.of(
      [])
    );

    spyOn(alarmService, 'getAlarmCount').and.returnValue(Observable.of(
      {
        'alarmstotal': 15
      })
    );

    spyOn(locationDashboardService, 'getLocations').and.returnValue(Observable.of(
      [{
        'dataCollectTaskID': 0,
        'exportDataToFtp': false,
        'geographicLoc': {
          'elevation': 0.0,
          'latitude': 33.55550003,
          'longitude': -84.46941375
        },
        'installationId': 6418,
        'installationLoadCustom': false,
        'isActiveLocation': true,
        'lastCollectedDate': '2016-10-03T01:30:01',
        'locationId': 3,
        'locationName': 'ADPS',
        'locationType': 1,
        'publicationGroupID': 0,
        'rainGaugeAssignmentDate': '2016-09-27T11:24:49.14',
        'wasCreatedFromImport': true,
        'series': 'Triton',
        'installationType': 0,
        'customerID': 63,
        'assignedRainGaugeId': 60,
        'monitoringPoint': 0,
        'monitorDeploymentID': 0
      }])
    );

    spyOn(locationGroupService, 'getLocationGroups').and.returnValue(Observable.of(
      {
        'locationGroups': [{
          'description': 'TestDescription',
          'locationGroupID': 150, 'locations': [{ 'locationID': 3, 'name': 'ADPS' }], 'name': 'Test1',
          'customerID': 63
        }]
      })
    );

    TestBed.configureTestingModule({
      imports: [AppModule],
      providers: [LocationDashboardService, CustomerService, LocationService, LocationGroupService,
        BatteryStatusService, AutoScrubSummaryService, DateutilService,
        MdSnackBar, AlarmService, BlockagePredictionService, HttpClient, AuthService, AdalService,
        MockBackend, BaseRequestOptions, ScheduleCollectionService, PreLoaderService,
        {
          provide: Http, HttpClient,
          useFactory: (mockBackend, options) => {
            return new Http(mockBackend, options);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        { provide: APP_BASE_HREF, useValue: '/' }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LocationDashboardComponent);
    fixture.detectChanges();
  });



  it('test getMapView', () => {
    let component = new LocationDashboardComponent(locationDashboardService,
      customerService, locationGroupService, mdDialog, batteryStatusService,
      autoScrubSummaryService, dateutilService, null, cdr, scheduleCollectionService, alarmService,
      blockagePredictionService, el, locationService, preLoaderService);
    component.getMapView({});
    expect(component.mapViews).toBeDefined();
  });

  it('test getMapTypes', () => {
    let component = new LocationDashboardComponent(locationDashboardService,
      customerService, locationGroupService, mdDialog, batteryStatusService,
      autoScrubSummaryService, dateutilService, null, cdr, scheduleCollectionService, alarmService,
      blockagePredictionService, el, locationService, preLoaderService);
    component.getMapTypes({});
    expect(component.mapTypes).toBeDefined();
  });

  it('test getLocations', () => {
    customerService.customerId = 63;
    let component = new LocationDashboardComponent(locationDashboardService,
      customerService, locationGroupService, mdDialog, batteryStatusService,
      autoScrubSummaryService, dateutilService, null, cdr, scheduleCollectionService, alarmService,
      blockagePredictionService, el, locationService, preLoaderService);
    component.getLocations({});
    expect(component.locations).toBeDefined();
    expect(component.locations.length).toBe(1);
  });

  it('should display map while validating showLocationMap', () => {
    let component = new LocationDashboardComponent(locationDashboardService,
      customerService, locationGroupService, mdDialog, batteryStatusService,
      autoScrubSummaryService, dateutilService, null, cdr, scheduleCollectionService, alarmService,
      blockagePredictionService, el, locationService, preLoaderService);
    component.showMap = true;
    component.showLocationMap(false);
    expect(component.showMap).toBe(false);
  });

  it('should display alarm search panel', () => {
    let component = new LocationDashboardComponent(locationDashboardService,
      customerService, locationGroupService, mdDialog, batteryStatusService,
      autoScrubSummaryService, dateutilService, null, cdr, scheduleCollectionService, alarmService,
      blockagePredictionService, el, locationService, preLoaderService);
    component.showAlarmSearch = false;
    component.showAlarmSearchPanel();
    expect(component.showAlarmSearch).toBe(true);
  });

  it('should not display alarm search panel', () => {
    let component = new LocationDashboardComponent(locationDashboardService,
      customerService, locationGroupService, mdDialog, batteryStatusService,
      autoScrubSummaryService, dateutilService, null, cdr, scheduleCollectionService, alarmService,
      blockagePredictionService, el, locationService, preLoaderService);
    component.showAlarmSearch = true;
    component.showAlarmSearchPanel();
    expect(component.showAlarmSearch).toBe(false);
  });

  it('should expand alarm', () => {
    let component = new LocationDashboardComponent(locationDashboardService,
      customerService, locationGroupService, mdDialog, batteryStatusService,
      autoScrubSummaryService, dateutilService, null, cdr, scheduleCollectionService, alarmService,
      blockagePredictionService, el, locationService, preLoaderService);
    component.showMap = true;
    component.showAlarmColumn = false;
    component.expandAlarm();
    expect(component.showMap).toBe(false);
    expect(component.showAlarmColumn).toBe(true);
  });

  it('should display battery status', () => {
    let component = new LocationDashboardComponent(locationDashboardService,
      customerService, locationGroupService, mdDialog, batteryStatusService,
      autoScrubSummaryService, dateutilService, null, cdr, scheduleCollectionService, alarmService,
      blockagePredictionService, el, locationService, preLoaderService);
    component.showBatteryStatusSearch = false;
    component.showBatteryStatus();
    expect(component.showBatteryStatusSearch).toBe(true);
  });

  it('should not display battery status', () => {
    let component = new LocationDashboardComponent(locationDashboardService,
      customerService, locationGroupService, mdDialog, batteryStatusService,
      autoScrubSummaryService, dateutilService, null, cdr, scheduleCollectionService, alarmService,
      blockagePredictionService, el, locationService, preLoaderService);
    component.showBatteryStatusSearch = true;
    component.showBatteryStatus();
    expect(component.showBatteryStatusSearch).toBe(false);
  });

  it('should not hide battery status search', () => {
    let component = new LocationDashboardComponent(locationDashboardService,
      customerService, locationGroupService, mdDialog, batteryStatusService,
      autoScrubSummaryService, dateutilService, null, cdr, scheduleCollectionService, alarmService,
      blockagePredictionService, el, locationService, preLoaderService);
    component.showBatteryStatusSearch = false;
    component.onHideBatteryStatusSearch(true);
    expect(component.showBatteryStatusSearch).toBe(true);
  });

  it('should hide battery status search', () => {
    let component = new LocationDashboardComponent(locationDashboardService,
      customerService, locationGroupService, mdDialog, batteryStatusService,
      autoScrubSummaryService, dateutilService, null, cdr, scheduleCollectionService, alarmService,
      blockagePredictionService, el, locationService, preLoaderService);
    component.showBatteryStatusSearch = true;
    component.onHideBatteryStatusSearch(false);
    expect(component.showBatteryStatusSearch).toBe(false);
  });

  it('should display collection search panel', () => {
    let component = new LocationDashboardComponent(locationDashboardService,
      customerService, locationGroupService, mdDialog, batteryStatusService,
      autoScrubSummaryService, dateutilService, null, cdr, scheduleCollectionService, alarmService,
      blockagePredictionService, el, locationService, preLoaderService);
    component.showCollectionSearch = false;
    component.showCollectionSearchPanel();
    expect(component.showCollectionSearch).toBe(true);
  });

  it('should not display collection search panel', () => {
    let component = new LocationDashboardComponent(locationDashboardService,
      customerService, locationGroupService, mdDialog, batteryStatusService,
      autoScrubSummaryService, dateutilService, null, cdr, scheduleCollectionService, alarmService,
      blockagePredictionService, el, locationService, preLoaderService);
    component.showCollectionSearch = true;
    component.showCollectionSearchPanel();
    expect(component.showCollectionSearch).toBe(false);
  });

  it('should display SearchCollection based on parameter', () => {
    let component = new LocationDashboardComponent(locationDashboardService,
      customerService, locationGroupService, mdDialog, batteryStatusService,
      autoScrubSummaryService, dateutilService, null, cdr, scheduleCollectionService, alarmService,
      blockagePredictionService, el, locationService, preLoaderService);
    component.showCollectionSearch = false;
    component.showSearchCollection(true);
    expect(component.showCollectionSearch).toBe(true);
  });

  it('should not display SearchCollection based on parameter', () => {
    let component = new LocationDashboardComponent(locationDashboardService,
      customerService, locationGroupService, mdDialog, batteryStatusService,
      autoScrubSummaryService, dateutilService, null, cdr, scheduleCollectionService, alarmService,
      blockagePredictionService, el, locationService, preLoaderService);
    component.showCollectionSearch = true;
    component.showSearchCollection(false);
    expect(component.showCollectionSearch).toBe(false);
  });

  it('should expand Collection', () => {
    let component = new LocationDashboardComponent(locationDashboardService,
      customerService, locationGroupService, mdDialog, batteryStatusService,
      autoScrubSummaryService, dateutilService, null, cdr, scheduleCollectionService, alarmService,
      blockagePredictionService, el, locationService, preLoaderService);
    component.showMap = true;
    component.showCollectionColumn = false;
    component.expandCollection();
    expect(component.showMap).toBe(false);
    expect(component.showCollectionColumn).toBe(true);
  });

  it('should not display map while validating showLocationMap', () => {
    let component = new LocationDashboardComponent(locationDashboardService,
      customerService, locationGroupService, mdDialog, batteryStatusService,
      autoScrubSummaryService, dateutilService, null, cdr, scheduleCollectionService, alarmService,
      blockagePredictionService, el, locationService, preLoaderService);
    component.showMap = false;
    component.showLocationMap(true);
    expect(component.showMap).toBe(true);
  });

  it('test blockagePrediction Tile', () => {
    customerService.customerId = 63;
    spyOn(alarmService, 'getActiveAlarm').and.returnValue(Observable.of(
      [{
        'id': 1, 'state': 0, 'type': 'High Depth', 'locationID': 1, 'location': 'Test Location',
        'timestamp': '2017-08-21T06:03:29.6007353+00:00'
      }, {
        'id': 4, 'state': 0, 'type': 'High Depth',
        'locationID': 4, 'location': 'ActivateTestLoc1', 'timestamp': '2017-08-21T06:03:29.6007353+00:00'
      }])
    );
    let component = new LocationDashboardComponent(locationDashboardService,
      customerService, locationGroupService, mdDialog, batteryStatusService,
      autoScrubSummaryService, dateutilService, null, cdr, scheduleCollectionService, alarmService,
      blockagePredictionService, el, locationService, preLoaderService);
    component.onCustomerChange(63);
    expect(component.blockagePredictionCount).toBe(11);
  });

  it('should display all locations whenever no failed scheduled collections avaliable on collection history widget', () => {
    customerService.customerId = 63;
    let component = new LocationDashboardComponent(locationDashboardService,
      customerService, locationGroupService, mdDialog, batteryStatusService,
      autoScrubSummaryService, dateutilService, null, cdr, scheduleCollectionService, alarmService,
      blockagePredictionService, el, locationService, preLoaderService);
    component.failedCollection = 1;
    component.filteredLocations = [{
      'dataCollectTaskID': 0,
      'exportDataToFtp': false,
      'geographicLoc': {
        'elevation': 0.0,
        'latitude': 33.55550003,
        'longitude': -84.46941375
      },
      'installationId': 6418,
      'installationLoadCustom': false,
      'isActiveLocation': true,
      'lastCollectedDate': new Date(),
      'locationId': 3,
      'locationName': 'ADPS',
      'locationType': 1,
      'publicationGroupID': 0,
      'rainGaugeAssignmentDate': new Date(),
      'wasCreatedFromImport': true,
      'series': 'Triton',
      'installationType': 0,
      'customerID': 63
    }]
    component.showCollectionWidget();
    expect(component.visibleCollectionWidget).toBe(true);
    expect(component.visibleDataReviewWidget).toBe(false);
    expect(component.visibleAlarmWidget).toBe(false);
    expect(component.vBATTERY).toBe(false);
    expect(component.visibleBlockagePrediction).toBe(false);
    expect(component.locations.length).toBe(component.filteredLocations.length);
  });

  it('should display all locations whenever no active alarms avaliable on alarm widget', () => {
    spyOn(alarmService, 'getActiveAlarm').and.returnValue(Observable.of(
      [])
    );
    let component = new LocationDashboardComponent(locationDashboardService,
      customerService, locationGroupService, mdDialog, batteryStatusService,
      autoScrubSummaryService, dateutilService, null, cdr, scheduleCollectionService, alarmService,
      blockagePredictionService, el, locationService, preLoaderService);
    component.alarmCount = 1;
    component.filteredLocations = [{
      'dataCollectTaskID': 0,
      'exportDataToFtp': false,
      'geographicLoc': {
        'elevation': 0.0,
        'latitude': 33.55550003,
        'longitude': -84.46941375
      },
      'installationId': 6418,
      'installationLoadCustom': false,
      'isActiveLocation': true,
      'lastCollectedDate': new Date(),
      'locationId': 3,
      'locationName': 'ADPS',
      'locationType': 1,
      'publicationGroupID': 0,
      'rainGaugeAssignmentDate': new Date(),
      'wasCreatedFromImport': true,
      'series': 'Triton',
      'installationType': 0,
      'customerID': 63
    }]
    component.showAlarmWidget();
    expect(component.showAlarmSearch).toBe(false);
    expect(component.showAlarmColumn).toBe(false);
    expect(component.visibleCollectionWidget).toBe(false);
    expect(component.visibleDataReviewWidget).toBe(false);
    expect(component.visibleAlarmWidget).toBe(true);
    expect(component.vBATTERY).toBe(false);
    expect(component.visibleBlockagePrediction).toBe(false);
    expect(component.locations.length).toBe(component.filteredLocations.length);
  });

  it('should display all locations whenever no location require for data review avaliable on auto review widget', () => {
    let component = new LocationDashboardComponent(locationDashboardService,
      customerService, locationGroupService, mdDialog, batteryStatusService,
      autoScrubSummaryService, dateutilService, null, cdr, scheduleCollectionService, alarmService,
      blockagePredictionService, el, locationService, preLoaderService);
    component.filteredLocations = [{
      'dataCollectTaskID': 0,
      'exportDataToFtp': false,
      'geographicLoc': {
        'elevation': 0.0,
        'latitude': 33.55550003,
        'longitude': -84.46941375
      },
      'installationId': 6418,
      'installationLoadCustom': false,
      'isActiveLocation': true,
      'lastCollectedDate': new Date(),
      'locationId': 3,
      'locationName': 'ADPS',
      'locationType': 1,
      'publicationGroupID': 0,
      'rainGaugeAssignmentDate': new Date(),
      'wasCreatedFromImport': true,
      'series': 'Triton',
      'installationType': 0,
      'customerID': 63
    }]
    component.showDataReviewWidget();
    expect(component.visibleCollectionWidget).toBe(false);
    expect(component.visibleDataReviewWidget).toBe(true);
    expect(component.visibleAlarmWidget).toBe(false);
    expect(component.vBATTERY).toBe(false);
    expect(component.visibleBlockagePrediction).toBe(false);
    expect(component.locations.length).toBe(component.filteredLocations.length);
  });

  it('should display all locations whenever no location require for data review avaliable on auto review widget', () => {
    let component = new LocationDashboardComponent(locationDashboardService,
      customerService, locationGroupService, mdDialog, batteryStatusService,
      autoScrubSummaryService, dateutilService, null, cdr, scheduleCollectionService, alarmService,
      blockagePredictionService, el, locationService, preLoaderService);
    component.blockagePredictionCount = 1;
    component.blockagePredictionDetails = [];
    component.filteredLocations = [{
      'dataCollectTaskID': 0,
      'exportDataToFtp': false,
      'geographicLoc': {
        'elevation': 0.0,
        'latitude': 33.55550003,
        'longitude': -84.46941375
      },
      'installationId': 6418,
      'installationLoadCustom': false,
      'isActiveLocation': true,
      'lastCollectedDate': new Date(),
      'locationId': 3,
      'locationName': 'ADPS',
      'locationType': 1,
      'publicationGroupID': 0,
      'rainGaugeAssignmentDate': new Date(),
      'wasCreatedFromImport': true,
      'series': 'Triton',
      'installationType': 0,
      'customerID': 63
    }]
    component.showBlockagePredictionwWidget();
    expect(component.visibleCollectionWidget).toBe(false);
    expect(component.visibleDataReviewWidget).toBe(false);
    expect(component.visibleAlarmWidget).toBe(false);
    expect(component.vBATTERY).toBe(false);
    expect(component.visibleBlockagePrediction).toBe(true);
    expect(component.locations.length).toBe(component.filteredLocations.length);
  });
});
