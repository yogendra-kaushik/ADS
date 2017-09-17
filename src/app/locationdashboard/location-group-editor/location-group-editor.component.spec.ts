import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LocationGroupEditorComponent } from '../location-group-editor/location-group-editor.component';
import { Http, BaseRequestOptions } from '@angular/http';
import { MaterialModule, MD_DIALOG_DATA, MdDialogRef, MdSnackBar, MdDialog } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient } from '../../shared/services/http-client';
import { MockBackend } from '@angular/http/testing';
import { AuthService } from '../../shared/services/auth.service';
import { Injectable, ChangeDetectorRef } from '@angular/core';
import { LocationGroupService } from '../../shared/services/location-group.service';
import { LocationDashboardService } from '../../shared/services/location-dashboard.service';
import { CustomerService } from '../../shared/services/customer.service';
import { OrderByPipe } from '../../shared/pipes/order-by-pipe';
import { FormsModule, NgForm } from '@angular/forms';
import { PagingComponent } from '../../shared/components/paging/paging.component';
import { Observable } from 'rxjs/Observable';
import { Config } from '../../shared/services/config';

@Injectable()
class MockAuthService extends AuthService {
  constructor() {
    super(null);
  }
  init() {
  }
}

class MdDialogRefMock {
}

const Mock_MD_DIALOG_DATA = {
  locations: [{
    assignedRainGaugeId: 60, customerID: 63, dataCollectTaskID: 0, exportDataToFtp: false,
    geographicLoc: { elevation: 1, latitude: 33.55550003, longitude: -84.46941375 }, installationId: 6418, installationLoadCustom: false,
    isActiveLocation: true, lastCollectedDate: new Date(), locationId: 3,
    series: '4000',
    locationName: 'ADPS', locationType: 1,
    publicationGroupID: 2,
    rainGaugeAssignmentDate: new Date(),
    wasCreatedFromImport: false,
    installationType: 2
  }],
  locationGroups: [{
    description: 'TestDescription',
    locationGroupID: 150, locations: [{ locationID: 3, name: 'ADPS' }], name: 'Test1',
    customerID: 63
  }]
};

class ChangeDetectorReference extends ChangeDetectorRef {
  markForCheck(): void {
  }
  detach(): void {
  }
  detectChanges(): void {
  }
  checkNoChanges(): void {
  }
  reattach(): void {
  }
}

describe('LocationGroupEditorComponent', () => {
  let component: LocationGroupEditorComponent;
  let fixture: ComponentFixture<LocationGroupEditorComponent>;
  let customerService: CustomerService;
  let locationGroupService: LocationGroupService;
  let locationDashboardService: LocationDashboardService;
  let changeDetectorRef: ChangeDetectorRef;


  beforeEach(async(() => {
    customerService = new CustomerService(null);
    locationGroupService = new LocationGroupService(null);
    changeDetectorRef = new ChangeDetectorReference();
    locationDashboardService = new LocationDashboardService(null, null);
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 12000;
    customerService.customerId = 5009;
    spyOn(customerService, 'getCustomers').and.returnValue(Observable.of(
      [{
        'customerID': 63, 'customerName': 'Fulton County, GA',
        'shortName': 'Fulton', 'isActive': true
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

    component = new LocationGroupEditorComponent(locationGroupService, locationDashboardService, customerService,
      null, changeDetectorRef, null, Mock_MD_DIALOG_DATA, null);

    TestBed.configureTestingModule({
      declarations: [LocationGroupEditorComponent, OrderByPipe, PagingComponent],
      imports: [MaterialModule, BrowserAnimationsModule, FormsModule],
      providers: [HttpClient, MockBackend, BaseRequestOptions, LocationGroupService,
        LocationDashboardService, CustomerService, MdSnackBar, MdDialog,
        {
          provide: Http, HttpClient,
          useFactory: (mockBackend, options) => {
            return new Http(mockBackend, options);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        { provide: AuthService, useClass: MockAuthService },
        { provide: MD_DIALOG_DATA, useValue: Mock_MD_DIALOG_DATA },
        { provide: MdDialogRef, useClass: MdDialogRefMock }
      ]
    })
      .compileComponents();
    fixture = TestBed.createComponent(LocationGroupEditorComponent);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should execute ngOnInit', () => {
    component.ngOnInit();
    expect(component.locationGroupHeader).toBe('Add Location Group');
    expect(component.actionSaveEdit).toBe('Save');
    expect(component.hideGroupSection).toBe(false);
    expect(component.locationGroups.length).toBe(1);
    expect(component.localLocationGroups.length).toBe(1);
    expect(component.locations.length).toBe(1);
    expect(component.displayPagination).toBe(true);
  });

  it('should execute showPageRecords', () => {
    component.showPageRecords(Mock_MD_DIALOG_DATA.locations);
    expect(component.pagedItems.length).toBe(1);
  });

  it('should execute showGroupPageRecords', () => {
    component.showGroupPageRecords(Mock_MD_DIALOG_DATA.locationGroups);
    expect(component.groupPagedItems.length).toBe(1);
  });

  it('should execute createLocationGroup', () => {
    component.createLocationGroup();
    expect(component.locationGroupHeader).toBe('Add Location Group');
    expect(component.hideGroupSection).toBe(true);
    expect(component.locationGroupName).toBe('');
    expect(component.locationGroupDescription).toBe('');
    expect(component.actionSaveEdit).toBe('Save');
    expect(component.isValidForCheckboxList).toBe(true);
  });

  it('should execute updateLocationGroup', () => {
    component.updateLocationGroup(Mock_MD_DIALOG_DATA.locationGroups[0]);
    expect(component.hideLocationMsg).toBe(true);
    expect(component.hideGroupSection).toBe(true);
    expect(component.hideCreateButton).toBe(true);
    expect(component.isValidForCheckboxList).toBe(true);
    expect(component.locationGroupHeader).toBe('Edit Location Group');
    expect(component.actionSaveEdit).toBe('Update');
    expect(component.locationGroupName).toBe('Test1');
    expect(component.locationGroupDescription).toBe('TestDescription');
    expect(component.locationGroupIdUpdate).toBe(150);
  });

  it('should execute createLocationCollections', () => {
    component.createLocationCollections(Mock_MD_DIALOG_DATA.locations, Mock_MD_DIALOG_DATA.locationGroups[0]);
    expect(component.localLocationsCollection.length).toBe(1);
  });

  it('should execute createLocationGroups', () => {
    let locationGroups = [{
      description: 'TestDescription',
      locationGroupID: 150, locations: [], name: 'Test1',
      customerID: 63
    }];
    component.locationGroups = locationGroups;
    let tempLocationGroups = component.createLocationGroups(locationGroups);
    expect(tempLocationGroups.length).toBe(1);
    expect(tempLocationGroups[0].customerID).toBe(5009);
    expect(tempLocationGroups[0].locationGroupID).toBe(150);
    expect(tempLocationGroups[0].name).toBe('Test1');
    expect(tempLocationGroups[0].description).toBe('TestDescription');
  });

  it('should execute loadLocationGroups', () => {
    component.loadLocationGroups();
    expect(component.locationGroups.length).toBe(1);
    expect(component.localLocationGroups.length).toBe(1);
    expect(component.hideGroupSection).toBe(false);
    expect(component.hideGroupSection).toBe(false);
  });

});
