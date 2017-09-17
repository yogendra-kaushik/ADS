import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewDataComponent } from './view-data.component';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions } from '@angular/http';
import { Http } from '@angular/http';
import {
  HttpClient, DateutilService, LocationDashboardService, CustomerService, LocationGroupService,
  AuthService, OrderByPipe
} from 'app/shared';
import { ViewDataService } from 'app/shared/services/view-data.service';
import { MaterialModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { MyDatePickerModule } from 'mydatepicker';
import { Injectable } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartModule } from 'angular2-highcharts';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
import { highchartsFactory } from 'app';
import { Observable } from 'rxjs/Rx';

@Injectable()
class MockAuthService extends AuthService {
  constructor() {
    super(null);
  }
  init() {
  }
}

describe('ViewDataComponent', () => {
  let component: ViewDataComponent;
  let fixture: ComponentFixture<ViewDataComponent>;
  let viewDataService: ViewDataService;
  let locationDashboardService: LocationDashboardService;
  let customerService: CustomerService;
  let locationGroupService: LocationGroupService;
  let dateutilService: DateutilService;


  beforeEach(async(() => {
    viewDataService = new ViewDataService(null);
    customerService = new CustomerService(null);
    locationDashboardService = new LocationDashboardService(null, customerService);
    locationGroupService = new LocationGroupService(null);
    dateutilService = new DateutilService();

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

    spyOn(viewDataService, 'getHydrograph').and.returnValue(Observable.of(
      {
        'title': 'ADPS',
        'subTitle': '8/11/2017 12:00:00 AM - 8/18/2017 2:56:59 PM',
        'start': '2017-08-11T00:00:00',
        'end': '2017-08-18T14:56:59',
        'displayGroups': [{
          'id': 2,
          'axis': {
            'minimum': 0.0,
            'maximum': 4.0,
            'label': 'Depth'
          },
          'sortOrder': 1,
          'style': 'line',
          'entityInformation': [{
            'id': 4122,
            'name': 'UniDepth',
            'color': -16776961
          }],
          'entityData': [{
            'ts': '2017-08-16T01:45:00',
            'E': {
              '4122': 1.36280584
            }
          }, {
            'ts': '2017-08-18T01:30:00',
            'E': {
              '4122': 1.26948547
            }
          }]
        }, {
          'id': 5,
          'axis': {
            'minimum': 0.0,
            'maximum': 4.0,
            'label': 'Velocity'
          },
          'sortOrder': 2,
          'style': 'line',
          'entityInformation': [{
            'id': 4202,
            'name': 'Vel',
            'color': -65536
          }],
          'entityData': [{
            'ts': '2017-08-16T01:45:00',
            'E': {
              '4202': 1.06162536
            }
          }]
        }]
      }
    )
    );

    spyOn(viewDataService, 'getScatterpgraph').and.returnValue(Observable.of(
      {
        'title': 'FBN5 (VELOCITY - UNIDEPTH)',
        'subTitle': '6/6/2017 12:00:00 AM - 6/7/2017 11:59:59 PM',
        'start': '2017-06-06T00:00:00',
        'end': '2017-06-07T23:59:59',
        'xAxis': {
          'minimum': 0.0,
          'maximum': 2.0,
          'label': 'Depth (in)'
        },
        'yAxis': {
          'minimum': 0.0,
          'maximum': 1.0,
          'label': 'Velocity (ft/s)'
        },
        'data': [{
          'dateTime': '2017-06-07T02:00:00',
          'x': 1.76263618,
          'y': 0.4030434
        }, {
          'dateTime': '2017-06-07T02:15:00',
          'x': 1.17177677,
          'y': 0.3951019
        }, {
          'dateTime': '2017-06-07T23:45:00',
          'x': 1.11570907,
          'y': 0.331034631
        }]
      }
    )
    );

    component = new ViewDataComponent(viewDataService, dateutilService, locationDashboardService, customerService, locationGroupService);
    // jasmine.DEFAULT_TIMEOUT_INTERVAL = 12000;

    TestBed.configureTestingModule({
      declarations: [ViewDataComponent, OrderByPipe],
      imports: [MaterialModule, BrowserAnimationsModule, FormsModule, MyDatePickerModule, ChartModule],
      providers: [ViewDataService, DateutilService, LocationDashboardService, CustomerService, LocationGroupService,
        HttpClient,
        MockBackend, BaseRequestOptions,
        {
          provide: Http, HttpClient,
          useFactory: (mockBackend, options) => {
            return new Http(mockBackend, options);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        { provide: AuthService, useClass: MockAuthService },
        {
          provide: HighchartsStatic,
          useFactory: highchartsFactory
        }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ViewDataComponent);
    fixture.detectChanges();
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit', () => {
    customerService.customerId = 63;
    let entityId = [4122, 4202, 3302, 2123];
    let entities = [{ text: 'UNIDEPTH', entityId: 4122 }, { text: 'SDEPTH_3', entityId: 4106 },
    { text: 'PDEPTH_1', entityId: 5122 }, { text: 'PDEPTH', entityId: 5104 }, { text: 'LRDEPTH', entityId: 5141 },
    { text: 'PDEPTH_3', entityId: 5124 }, { text: 'UpDEPTH_1', entityId: 5125 }, { text: 'RAWVEL', entityId: 5201 },
    { text: 'VELOCITY', entityId: 4202 }, { text: 'QCONTINUITY', entityId: 3302 }, { text: 'QMANNING', entityId: 3307 },
    { text: 'RAIN', entityId: 2123 }];
    component.ngOnInit();
    expect(component.checkGraph).toBe(true);
    expect(component.entityId.length).toBe(entityId.length);
    expect(component.entities.length).toBe(entities.length);

  });

  it('should load locations', () => {
    component.loadLocations(63);
    expect(component.locationId).toBe(3);
    expect(component.resetLocationId).toBe(3);
  });

  it('should display hydrograph', () => {
    component.displayHydroGraph();
    expect(component.noHydroDataFound).toBe(false);
    expect(component.displayDepthName).toBe('');
    expect(component.displayFlowName).toBe('');
    expect(component.displayRainName).toBe('');
    expect(component.displayVelocityName).toBe('');
    expect(component.showHydrograph).toBe(true);
  });

  it('should display scattergraph', () => {
    component.displayScatterGraph();
    expect(component.xAxisLabel).toBe('Depth (in)');
    expect(component.yAxisLabel).toBe('Velocity (ft/s)');
    expect(component.noScatterGraphDataFound).toBe(false);
  });

});
