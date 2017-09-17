import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AlarmWidgetComponent } from './alarm-widget.component';
import { BaseRequestOptions, Http } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { Injectable } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { MyDatePickerModule, IMyInputFieldChanged } from 'mydatepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PagingComponent, LoaderComponent } from '../../shared/components';
import { ChartModule } from 'angular2-highcharts';
import { SelectModule } from 'ng2-select';
import {
  LocationGroupService, AlarmService, DateutilService, AuthService, CustomerService,
  LocationService, HttpClient
} from 'app/shared/services';
import { Observable } from 'rxjs/Observable';
import { By } from '@angular/platform-browser';

@Injectable()
class MockAuthService extends AuthService {
  constructor() {
    super(null);
  }
  init() {
  }
}

class MockAlarmService extends AlarmService {
  constructor() {
    super(null);
  }

  getAlarms(customerId: number, startDate: any, endDate: any, status: number, locationGroupId?: number) {
    return Observable.of([{
      'id': 1,
      'state': 0,
      'type': 'High Depth',
      'locationID': 1,
      'location': '3GEM_31337',
      'timestamp': '2017-08-31T13:42:00.4728224+00:00'
    },
    {
      'id': 4,
      'state': 0,
      'type': 'High Depth',
      'locationID': 4,
      'location': 'Dynamic_50499(2)',
      'timestamp': '2017-08-31T13:42:00.4728224+00:00'
    }]);
  }
}

class MockCustomerService extends CustomerService {
  constructor() {
    super(null);
    this.customerId = 796;
  }
}

class MockLocationService extends LocationService {
  public locationId: number;
  constructor() {
    super(null);
    this.locationId = null;
  }
}

class MockLocatinGroupService extends LocationGroupService {
  constructor() {
    super(null);
  }
}

class MockDateutilService extends DateutilService {
  constructor() {
    super();
  }
}

describe('AlarmComponent', () => {
  let component: AlarmWidgetComponent;
  let fixture: ComponentFixture<AlarmWidgetComponent>;
  let alarmService: AlarmService;
  let customerService: CustomerService;
  let locationService: LocationService;
  let locatioinGroupService: LocationGroupService;
  let dateutilService: DateutilService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [AlarmWidgetComponent, LoaderComponent, PagingComponent],
      imports: [MaterialModule, BrowserAnimationsModule, ChartModule, FormsModule, MyDatePickerModule, SelectModule],
      providers: [HttpClient, MockBackend, BaseRequestOptions,
        { provide: AlarmService, useClass: AlarmService },
        { provide: CustomerService, useClass: CustomerService },
        { provide: LocationService, useClass: MockLocationService },
        { provide: LocationGroupService, useClass: MockLocatinGroupService },
        { provide: DateutilService, useClass: DateutilService },
        {
          provide: Http, HttpClient,
          useFactory: (mockBackend, options) => {
            return new Http(mockBackend, options);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        { provide: AuthService, useClass: MockAuthService }
      ]
    });

    fixture = TestBed.overrideComponent(LoaderComponent, { set: { template: '<div>Overriden item here</div>' } })
      .createComponent(AlarmWidgetComponent);
    component = fixture.componentInstance;
    alarmService = fixture.debugElement.injector.get(AlarmService);
    locationService = fixture.debugElement.injector.get(LocationService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.users).toContain('All');
  });

  it('should initialize', () => {
    component.ngOnInit()
    expect(component.listOfStatus).toEqual([{ text: 'Unacknowledged', value: 0 }, { text: 'Uncleared', value: 1 },
    { text: 'Cleared', value: 2 }]);
  });

  it('should hide alarm search on customer change', () => {
    spyOn(component, 'hideAlarmSearchPanel');
    spyOn(component, 'resetAlarmParameters');
    component.onCustomerChange();
    fixture.detectChanges();
    expect(component.hideAlarmSearchPanel).toHaveBeenCalled();
    expect(component.resetAlarmParameters).toHaveBeenCalled();
  });

  it('should change valid start date', () => {
    component.onStartDateChanged({ valid: true, value: '2017-01-01', dateFormat: 'yyyy-mm-dd' });
    fixture.detectChanges();
    expect(component.displayStartDateErrMsg).toEqual(false);
    expect(component.invalidStartDate).toEqual(false);
  });

  /* it('should display error message for invalid date', () => {
    spyOn(component, 'monthDifference');
    component.onStartDateChanged({ valid: false, value: '', dateFormat: 'yyyy-mm-dd' });
    fixture.detectChanges();

    expect(component.startDateValidity).toEqual(false);
    expect(component.displayStartDateErrMsg).toEqual(true);
    expect(component.invalidStartDate).toEqual(false);
    expect(component.monthDifference).toHaveBeenCalled();
  });

  it('should calculate difference between start date and end date', () => {
    let startDate = '01/01/2017';
    let endDate = '01/30/2017';
    component.monthDifference(startDate, endDate);
    expect(component.invalidDateRange).toEqual(false);
  });

  it('should set invalid date range for 30+ days difference', () => {
    let startDate = '01/01/2017';
    let endDate = '02/15/2017';
    component.startDateValue = startDate;
    component.monthDifference(startDate, endDate);
    expect(component.invalidDateRange).toEqual(true);
  });*/

  it('should generate alarm history', () => {
    spyOn(alarmService, 'getAlarms').and.returnValue({ subscribe: () => { } });
    component.generateAlarmHistory();
    expect(component.alarmWidgetLoadingState).toEqual(true);
    expect(alarmService.getAlarms).toHaveBeenCalled();
    expect(component.activeAlarms).toBeTruthy();
  });

  it('should hide alarm search panel', () => {
    component.hideAlarmSearchPanel();
    expect(component.showAlarmSearch).toEqual(false);
  });

  it('should reset alarmParameters', () => {
    component.resetAlarmParameters();
    expect(component.status).toEqual(null);
    expect(component.startDate).toBeDefined();
    expect(component.endDate).toBeDefined();
    expect(component.selectedUsers.length).toEqual(0);
  });
});
