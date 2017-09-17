import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Http, BaseRequestOptions } from '@angular/http';
import { MaterialModule, MD_DIALOG_DATA, MdDialogRef, MdSnackBar, MdDialog, MdSnackBarRef, SimpleSnackBar } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MockBackend } from '@angular/http/testing';
import { Injectable, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { CollectionWidgetScheduleComponent } from '../collection-widget-schedule/collection-widget-schedule.component';
import { OrderByPipe } from '../../shared/pipes/order-by-pipe';
import { PagingComponent } from '../../shared/components';
import { ScheduleCollectionService, CustomerService, HttpClient, AuthService, LocationService } from 'app/shared/services';

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

const Mock_MD_DIALOG_DATA = {
  locations: [{
    assignedRainGaugeId: 60, customerID: 63, dataCollectTaskID: 0, exportDataToFtp: false,
    geographicLoc: { elevation: 1, latitude: 33.55550003, longitude: -84.46941375 }, installationId: 6418, installationLoadCustom: false,
    isActiveLocation: true, lastCollectedDate: new Date(), locationId: 3,
    locationName: 'ADPS', locationType: 1,
    publicationGroupID: 2,
    rainGaugeAssignmentDate: new Date(),
    wasCreatedFromImport: false,
    installationType: 2
  }],
  schedules: [{
    'scheduleId': 109,
    'name': 'testing', 'frequency': '4Hrs 0mins',
    'alarmingFrequency': '4Hrs 0mins', 'collectionDays': 'Sun,M',
    'locations': [{ 'locationId': 3, 'name': 'TestLoc2' }]
  }]
};

describe('CollectionWidgetScheduleComponent', () => {
  let component: CollectionWidgetScheduleComponent;
  let fixture: ComponentFixture<CollectionWidgetScheduleComponent>;
  let changeDetectorRef: ChangeDetectorRef;
  let scheduleCollectionService: ScheduleCollectionService;
  let mdSnackBar: MdSnackBar;
  let simpleSnackBar: SimpleSnackBar;
  let customerService: CustomerService;
  let locationService: LocationService;

  beforeEach(async(() => {
    scheduleCollectionService = new ScheduleCollectionService(null);
    mdSnackBar = new MdSnackBar(null, null, null);
    simpleSnackBar = new SimpleSnackBar();
    changeDetectorRef = new ChangeDetectorReference();
    customerService = new CustomerService(null);
    locationService = new LocationService(null);
    let simpleSnackBarRef = new MdSnackBarRef<SimpleSnackBar>(null, null, null);


    spyOn(simpleSnackBarRef, 'dismiss').and.returnValue(
      {}
    );

    spyOn(mdSnackBar, 'open').and.returnValue(
      simpleSnackBarRef
    );

    spyOn(scheduleCollectionService, 'getScheduleCollection').and.returnValue(Observable.of(
      {
        schedules: [{
          'scheduleId': 109,
          'name': 'testing', 'frequency': '4Hrs 0mins',
          'alarmingFrequency': '4Hrs 0mins', 'collectionDays': 'Sun,M',
          'locations': [{ 'locationId': 3, 'name': 'TestLoc2' }]
        }]
      })
    );

    component = new CollectionWidgetScheduleComponent(scheduleCollectionService, changeDetectorRef, null, mdSnackBar,
      Mock_MD_DIALOG_DATA, null, customerService, locationService);

    TestBed.configureTestingModule({
      declarations: [CollectionWidgetScheduleComponent, OrderByPipe, PagingComponent],
      imports: [MaterialModule, BrowserAnimationsModule, FormsModule],
      providers: [HttpClient, MockBackend, BaseRequestOptions, CustomerService, ScheduleCollectionService,

        {
          provide: Http, HttpClient,
          useFactory: (mockBackend, options) => {
            return new Http(mockBackend, options);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        { provide: AuthService, useClass: MockAuthService },
        { provide: MdDialogRef, useClass: MdDialogRefMock },
        { provide: MD_DIALOG_DATA, useValue: Mock_MD_DIALOG_DATA }
      ]
    })
      .compileComponents();
    fixture = TestBed.createComponent(CollectionWidgetScheduleComponent);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should execute ngOnInit', () => {
    component.ngOnInit();
    expect(component.locations.length).toBe(Mock_MD_DIALOG_DATA.locations.length);
    expect(component.actionSaveEdit).toBe('Save');
    expect(component.schedules.length).toBe(Mock_MD_DIALOG_DATA.schedules.length);
  });

  it('should execute createScheduleCollection', () => {
    component.createScheduleCollection();
    expect(component.showCreateSchedule).toBeTruthy();
    expect(component.scheduleName).toBe('');
    expect(component.frequency).toBe(null);
    expect(component.alarmingFrequency).toBe(null);
    expect(component.scheduleCollectionHeader).toBe('Add Schedule Collection');
    expect(component.actionSaveEdit).toBe('Save');
  });

  it('should execute updateScheduleCollection', () => {
    component.listOfDays = [{ text: 'S', isSelected: false, apiText: 'Sun' }, { text: 'M', isSelected: false, apiText: 'M' },
    { text: 'T', isSelected: false, apiText: 'T' }, { text: 'W', isSelected: false, apiText: 'W' },
    { text: 'T', isSelected: false, apiText: 'Th' }, { text: 'F', isSelected: false, apiText: 'F' },
    { text: 'S', isSelected: false, apiText: 'Sa' }];
    component.updateScheduleCollection(Mock_MD_DIALOG_DATA.schedules[0]);
    expect(component.showCreateSchedule).toBe(true);
    expect(component.hideCreateButton).toBe(true);
    expect(component.actionSaveEdit).toBe('Update');
    expect(component.scheduleCollectionHeader).toBe('Edit Schedule Collection');
    expect(component.disableUpdate).toBe(true);
    expect(component.validateScheduleName).toBe(true);
    expect(component.scheduleName).toBe(Mock_MD_DIALOG_DATA.schedules[0].name);
    expect(component.frequency).toBe(4);
  });

  it('should execute saveScheduleCollection', () => {
    spyOn(scheduleCollectionService, 'postScheduleCollection').and.returnValue(Observable.of(
      [])
    );
    component = new CollectionWidgetScheduleComponent(scheduleCollectionService, changeDetectorRef, null, mdSnackBar,
      Mock_MD_DIALOG_DATA, null, customerService, locationService);
    component.scheduleName = 'AbhinavTest';
    component.frequency = 4;
    component.alarmingFrequency = 4;
    component.localListOfDays = [{ text: 'S', isSelected: false, apiText: 'Sun' }, { text: 'M', isSelected: false, apiText: 'M' },
    { text: 'T', isSelected: false, apiText: 'T' }, { text: 'W', isSelected: false, apiText: 'W' },
    { text: 'T', isSelected: false, apiText: 'Th' }, { text: 'F', isSelected: false, apiText: 'F' },
    { text: 'S', isSelected: true, apiText: 'Sa' }];
    component.actionSaveEdit = 'Save';
    component.saveScheduleCollection();
    expect(component.schedules.length).toBe(1);
    expect(component.showCreateSchedule).toBe(false);
    expect(component.setFirstPage).toBe(true);
  });

  it('should verify duplicate schedule collection', () => {
    let error = {
      statusText: 'Conflict'
    };
    spyOn(scheduleCollectionService, 'postScheduleCollection').and.returnValue(Observable.throw(
      error)
    );
    component = new CollectionWidgetScheduleComponent(scheduleCollectionService, changeDetectorRef, null, mdSnackBar,
      Mock_MD_DIALOG_DATA, null, customerService, locationService);
    component.scheduleName = 'AbhinavTest';
    component.frequency = 4;
    component.alarmingFrequency = 4;
    component.localListOfDays = [{ text: 'S', isSelected: false, apiText: 'Sun' }, { text: 'M', isSelected: false, apiText: 'M' },
    { text: 'T', isSelected: false, apiText: 'T' }, { text: 'W', isSelected: false, apiText: 'W' },
    { text: 'T', isSelected: false, apiText: 'Th' }, { text: 'F', isSelected: false, apiText: 'F' },
    { text: 'S', isSelected: true, apiText: 'Sa' }];
    component.actionSaveEdit = 'Save';
    component.saveScheduleCollection();
    expect(component.saveScheduleCollection).toBeDefined();
  });

});
