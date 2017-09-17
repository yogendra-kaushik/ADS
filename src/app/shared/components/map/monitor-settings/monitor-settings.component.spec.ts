import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from 'app/shared/services/auth.service';
import { Injectable, ChangeDetectorRef } from '@angular/core';
import {
  MaterialModule, MD_DIALOG_DATA, MdDialogRef, MdSnackBar, MdDialog, MdSnackBarRef,
  SimpleSnackBar, MdSnackBarContainer, MdDialogContainer
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClient } from 'app/shared/services/http-client';
import { MockBackend } from '@angular/http/testing';
import { Http, BaseRequestOptions } from '@angular/http';
import { CustomerService } from 'app/shared/services';
import { MonitorSettingsComponent } from './monitor-settings.component';
import { LocationService } from 'app/shared/services/location.service';
import { MonitorSettingService } from 'app/shared/services/monitor-setting.service';
import { LoaderComponent } from 'app/shared/components/loader/loader.component';
import { Observable } from 'rxjs/Observable';

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
  data: {
    customerId: 63,
    LocationName: 'Test Location',
    Description: 'Test Description',
    ManholeAddress: 'Test Address',
    Latitude: 28.667788,
    Longitude: 78.667788,
    IsActiveLocation: true,
    MonitorSeries: 9015,
    SerialNumber: 9015,
    IpAddress: '166.219.172.234'
  }
};

describe('MonitorSettingsComponent', () => {
  let component: MonitorSettingsComponent;
  let fixture: ComponentFixture<MonitorSettingsComponent>;
  let changeDetectorRef: ChangeDetectorRef;
  let locationService: LocationService;
  let mdSnackBar: MdSnackBar;
  let simpleSnackBar: SimpleSnackBar;
  let customerService: CustomerService;
  let monitorSettingService: MonitorSettingService;
  let ActivateLocationLoadingState = false;
  let mdSnackBarContainer: MdSnackBarContainer;
  let mdDialogRefMock: MdDialogRefMock;

  beforeEach(async(() => {
    monitorSettingService = new MonitorSettingService(null);
    locationService = new LocationService(null);
    mdSnackBar = new MdSnackBar(null, null, null);
    simpleSnackBar = new SimpleSnackBar();
    changeDetectorRef = new ChangeDetectorReference();
    customerService = new CustomerService(null);
    mdSnackBarContainer = new MdSnackBarContainer(null, null, null);
    // mdDialogRefMock = new MdDialogRefMock();

    let simpleSnackBarRef = new MdSnackBarRef<SimpleSnackBar>(null, mdSnackBarContainer, null);


    spyOn(simpleSnackBarRef, 'dismiss').and.returnValue(
      {}
    );

    spyOn(mdSnackBar, 'open').and.returnValue(
      simpleSnackBarRef
    );
    spyOn(monitorSettingService, 'rainAlert').and.returnValue(Observable.of(
      { 'responseMessage': 'Configured' })
    );

    spyOn(monitorSettingService, 'activateLocation').and.returnValue(Observable.of(
      { 'responseMessage': 'Activated' })
    );
    component = new MonitorSettingsComponent(null, customerService, monitorSettingService, Mock_MD_DIALOG_DATA,
      locationService, mdSnackBar, changeDetectorRef);
    TestBed.configureTestingModule({
      declarations: [MonitorSettingsComponent, LoaderComponent],
      imports: [MaterialModule, BrowserAnimationsModule, FormsModule],
      providers: [HttpClient, MockBackend, BaseRequestOptions, CustomerService, MonitorSettingService, LocationService,
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
    fixture = TestBed.createComponent(MonitorSettingsComponent);
    fixture.detectChanges();
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should activate location', () => {
    component.monitorSetting.alarmthreshold = 1;
    spyOn(component, 'emitMonitorSettings');
    component.activateLocation();
    expect(component.monitorSetting.alarmthreshold).toBe(0);
    expect(component.ActivateLocationLoadingState).toBe(false);
    expect(component.emitMonitorSettings).toHaveBeenCalled();
  });
});
