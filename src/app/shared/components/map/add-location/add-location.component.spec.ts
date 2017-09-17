import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from 'app/shared/services/auth.service';
import { Injectable, ChangeDetectorRef } from '@angular/core';
import { MaterialModule, MD_DIALOG_DATA, MdDialogRef, MdSnackBar, MdDialog } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClient } from 'app/shared/services/http-client';
import { MockBackend } from '@angular/http/testing';
import { Http, BaseRequestOptions } from '@angular/http';
import { MonitorSettingsComponent } from 'app/shared/components/map/monitor-settings/monitor-settings.component';
import { AddLocationComponent } from './add-location.component';
import { CustomerService, LocationService } from 'app/shared/services';
import { AddLocation } from 'app/shared/models';
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

class MockLocationService extends LocationService {
  constructor() {
    super(null);
  }

  addLocation(customerID: number, _addLocation: AddLocation ) {
        return Observable.of("success");
  }
}

let mockNewLocation = new AddLocation();
mockNewLocation.locationName = "Test location";
mockNewLocation.description = "Test description";
mockNewLocation.manholeAddress = "Manhole address";
mockNewLocation.isActive = true;
mockNewLocation.series = "TRITON+";
mockNewLocation.serialNumber = '123456';
mockNewLocation.IPAddress = 1111;


describe('AddLocationComponent', () => {
  let component: AddLocationComponent;
  let fixture: ComponentFixture<AddLocationComponent>;
  let changeDetectorRef: ChangeDetectorRef;
  let locationService: LocationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddLocationComponent, LoaderComponent, MonitorSettingsComponent],
      imports: [MaterialModule, BrowserAnimationsModule, FormsModule],
      providers: [HttpClient, MockBackend, BaseRequestOptions, CustomerService,
        { provide: LocationService, useClass: MockLocationService },
        {
          provide: Http, HttpClient,
          useFactory: (mockBackend, options) => {
            return new Http(mockBackend, options);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        { provide: AuthService, useClass: MockAuthService },
        { provide: MdDialogRef, useClass: MdDialogRefMock },

      ]
    });

    fixture = TestBed
            .overrideComponent(LoaderComponent,{ set: { template: '<div>Overriden item here</div>' } })
            .createComponent(AddLocationComponent);
    component = fixture.componentInstance;

    locationService = fixture.debugElement.injector.get(LocationService);
  }));

  it('should be created', () => {
    expect(component).toBeDefined();
  });

  it('should be initialized', () => {
    spyOn(component, 'resetForm').and.callThrough();
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.isActives.length).toEqual(2);
    expect(component.MonitorSeriesUI.length).toEqual(3);

    expect(component.resetForm).toHaveBeenCalled();
    expect(component._addLocation).toBeDefined();
    expect(component._addLocation.isActive).toEqual(true);
  });

  it('should close dialog', () => {
    spyOn(component.onCloseLocationEditor, 'emit');
    component.routedFromCustomerEditor = true;
    component.emitAddLocation();
    fixture.detectChanges();
    expect(component.onCloseLocationEditor.emit).toHaveBeenCalled();
  });

  it('should add location', () => {
    spyOn(locationService, 'addLocation').and.returnValue({ subscribe: () => {} });
    component._addLocation = mockNewLocation;
    component.customerID = 796;
    component.addLocation();
    fixture.detectChanges();
    expect(locationService.addLocation).toHaveBeenCalled();
  });

  it('should reset form', () => {
    component.resetForm();
    expect(component._addLocation).toEqual({ locationName: null, description: null, manholeAddress: null, latitude: null, longitude: null, isActive: false, series: null, serialNumber: null, IPAddress: null });
  });
});
