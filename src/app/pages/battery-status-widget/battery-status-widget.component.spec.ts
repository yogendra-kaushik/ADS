/* tslint:disable:no-unused-variable */

import { Injectable, DebugElement, Component, OnInit, OnDestroy, ChangeDetectorRef, Input, EventEmitter, Output } from '@angular/core';
import { ComponentFixture, TestBed, async, fakeAsync, tick, inject } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { MaterialModule } from '@angular/material';
import {  } from 'app/shared/services/http-client';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http, HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartModule } from 'angular2-highcharts';
import { BatteryStatusWidgetComponent } from 'app/pages/battery-status-widget/battery-status-widget.component';
import { BatteryStatus } from 'app/shared/models/battery-status';
import { FormsModule } from '@angular/forms';
import { PagingComponent } from 'app/shared/components/paging/paging.component';
import { AdalService } from 'ng2-adal/services/adal.service';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
import { highchartsFactory } from 'app';
import { CustomerService } from 'app/shared/services';
import { HttpClient, AuthService, LocationService, LocationGroupService, PaginationService, BatteryStatusService } from 'app/shared/services';
import { LoaderComponent } from 'app/shared/components/loader/loader.component';

@Injectable()
class MockAuthService extends AuthService {
  constructor() {
    super(null);
  }
  init() {
  }
}

class MockBatteryService extends BatteryStatusService {
  constructor() {
    super(null, null);
  }

  public getBatteryStatus(customerId: number, locationGroupID?: number, locationID?: number, voltageParam?: number, statusParam?: string): Observable<any> {

    let batteryStatus1 = new BatteryStatus();
    batteryStatus1 = { locationID: 2, locationName: 'BC10', voltage: 9.28, status: 'GOOD' };

    let batteryStatus2 = new BatteryStatus();
    batteryStatus2 = { locationID: 7, locationName: 'FST-IM_50172', voltage: 10.35, status: 'GOOD' };

    let results = [batteryStatus1, batteryStatus2]
    return Observable.of(results);
  }
}

class MockCustomerService extends CustomerService {
  constructor() {
    super(null);
  }
}

describe('BatteryStatusWidgetComponent', () => {
  let component: BatteryStatusWidgetComponent;
  let fixture: ComponentFixture<BatteryStatusWidgetComponent>;
  let batterystatusService: BatteryStatusService;
  let locationService: LocationService;
  let locationGroupService: LocationGroupService;
  let customerService: CustomerService;

  beforeEach(async () => {

    TestBed.configureTestingModule({
      declarations: [BatteryStatusWidgetComponent, PagingComponent, LoaderComponent],
      imports: [MaterialModule, FormsModule, ChartModule],
      providers: [ LocationService, LocationGroupService, HttpClient, MockBackend, BaseRequestOptions, HighchartsStatic, highchartsFactory,
        { provide: BatteryStatusService, useClass: MockBatteryService },
        { provide: CustomerService, useClass: MockCustomerService },
        {
          provide: Http, HttpClient,
          useFactory: (mockBackend, options) => {
            return new Http(mockBackend, options);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        { provide: AuthService, useClass: MockAuthService },
        {
          provide: HighchartsStatic, useFactory: highchartsFactory
        }
      ]
    });

    fixture = TestBed
      .overrideComponent(PagingComponent, { set: { template: '<div>Overriden item here</div>' } })
      .overrideComponent(LoaderComponent,{ set: { template: '<div>Overriden item here</div>' } })
      .createComponent(BatteryStatusWidgetComponent);
    component = fixture.componentInstance;

    batterystatusService = fixture.debugElement.injector.get(BatteryStatusService);
  });

  //constructor
  it('should create component', () => {
    expect(component).toBeDefined();
  });


  //ngOnInit()

  it('should intialize component', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
    expect(component.statuses).toEqual(['CRITICAL', 'GOOD', 'LOW', 'UNKNOWN']);
  });

  
  //hideBatteryStatusSearchPanel()
  it('should hide search form', () => {
    component.onHideBatteryStatusSearch.subscribe(g => {
      expect(g).toEqual(false);
    });
  });


  //resetBatteryStatusParameters() 
  it('should reset search form', () => {
    component.resetBatteryStatusParameters();
    expect(component.selectedLocationID).toEqual(null);
    expect(component.selectedStatus).toEqual(null);
    expect(component.selectedVoltage).toEqual(null);
  });
  
});