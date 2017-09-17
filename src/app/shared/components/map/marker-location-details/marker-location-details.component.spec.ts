
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Injectable } from '@angular/core';
import { MarkerLocationDetailsComponent } from './marker-location-details.component';
import { MdSnackBar } from '@angular/material';
import { MaterialModule, MdDialog } from '@angular/material';
import { LocationDetails } from '../../../models/location-details';
import { GeneralComponent } from './general/general.component';
import { YesNoPipe } from '../../../pipes/yes-no.pipe';
import { DashedIfBlankPipe } from '../../../pipes/dashed-if-blank.pipe';
import { Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { AppModule } from 'app';
import { APP_BASE_HREF } from '@angular/common';
import { AdalService } from 'ng2-adal/services/adal.service';
import { SharedModule } from 'app/shared/shared.module';
import { AuthService } from 'app/shared/services/auth.service';
import { CollectService } from 'app/shared/services/collect.service';
import { LocationDashboardService } from 'app/shared/services/location-dashboard.service';
import { ScheduleCollectionService } from 'app/shared/services/schedule-collection.service';
import { CustomerService } from 'app/shared/services/customer.service';
import { HttpClient } from 'app/shared/services/http-client';
import { Observable } from 'rxjs/Rx';

@Injectable()
class MockAuthService extends AuthService {
  constructor() {
    super(null);
  }
  init() {
  }
}

describe('MarkerLocationDetailsComponent', () => {
  let component: MarkerLocationDetailsComponent;
  let fixture: ComponentFixture<MarkerLocationDetailsComponent>;
  let collectService: CollectService;
  let mdDialog: MdDialog;
  let mdSnackBar: MdSnackBar;
  let locationDashboardService: LocationDashboardService;
  let scheduleCollectionService: ScheduleCollectionService;
  let customerService: CustomerService;
  beforeEach(async(() => {
    locationDashboardService = new LocationDashboardService(null, null);
    customerService = new CustomerService(null);
    collectService = new CollectService(null);
    scheduleCollectionService = new ScheduleCollectionService(null);
    mdDialog = new MdDialog(null, null, null, null);
    mdSnackBar = new MdSnackBar(null, null, null);

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

    spyOn(scheduleCollectionService, 'getScheduleCollection').and.returnValue(Observable.of(
      { 'schedules': [] })
    );

    TestBed.configureTestingModule({
      declarations: [MarkerLocationDetailsComponent],
      imports: [MaterialModule, BrowserAnimationsModule, FormsModule],
      providers: [CollectService, MdDialog, LocationDashboardService, CustomerService,
        MdSnackBar, HttpClient, AuthService,
        MockBackend, BaseRequestOptions, ScheduleCollectionService,
        {
          provide: Http, HttpClient,
          useFactory: (mockBackend, options) => {
            return new Http(mockBackend, options);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        { provide: AuthService, useClass: MockAuthService },
        { provide: APP_BASE_HREF, useValue: '/' }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MarkerLocationDetailsComponent);
    fixture.detectChanges();
  }));

  it('should be created', () => {
    component = new MarkerLocationDetailsComponent(collectService, null, mdSnackBar,
      locationDashboardService, scheduleCollectionService, customerService, null);
    expect(component).toBeTruthy();
  });

  it('should display locationEditor', () => {
    component = new MarkerLocationDetailsComponent(collectService, null, mdSnackBar,
      locationDashboardService, scheduleCollectionService, customerService, null);
    component.showLocationEditor = false;
    component.locationEditor();
    expect(component.showLocationEditor).toBe(true);
  });

  it('should not display locationEditor', () => {
    component = new MarkerLocationDetailsComponent(collectService, null, mdSnackBar,
      locationDashboardService, scheduleCollectionService, customerService, null);
    component.showLocationEditor = true;
    component.locationEditor();
    expect(component.showLocationEditor).toBe(false);
  });

  it('should activate location', () => {
    component = new MarkerLocationDetailsComponent(collectService, null, mdSnackBar,
      locationDashboardService, scheduleCollectionService, customerService, null);
    component.Latitude = undefined;
    component.Longitude = undefined;
    component.IpAddress = undefined;
    component.activateLocation();
    expect(component.Latitude).toBe(0);
    expect(component.Longitude).toBe(0);
    expect(component.IpAddress).toBe('');
  });

});
