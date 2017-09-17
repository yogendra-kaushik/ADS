import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Http, BaseRequestOptions } from '@angular/http';
import { MaterialModule, MD_DIALOG_DATA, MdDialogRef, MdSnackBar, MdDialog } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient } from '../../shared/services/http-client';
import { MockBackend } from '@angular/http/testing';
import { AuthService } from '../../shared/services/auth.service';
import { Injectable, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Config } from '../../shared/services/config';
import { LocationDashboardService } from '../../shared/services/location-dashboard.service';
import { CollectionWidgetComponent } from '../collection-widget/collection-widget.component';
import { ScheduleCollectionService } from '../../shared/services/schedule-collection.service';
import { MyDatePickerModule } from 'mydatepicker';
import { PagingComponent } from '../../shared/components/paging/paging.component';
import { DateutilService } from '../../shared/services/dateutil.service';
import { LocationService } from 'app/shared/services/location.service';
import { CustomerService } from 'app/shared/services';
import { LocationGroupService } from 'app/shared';
import { SelectModule } from 'ng2-select';

@Injectable()
class MockAuthService extends AuthService {
  constructor() {
    super(null);
  }
  init() {
  }
}

describe('CollectionWidgetComponent', () => {
  let component: CollectionWidgetComponent;
  let fixture: ComponentFixture<CollectionWidgetComponent>;
  let changeDetectorRef: ChangeDetectorRef;
  let customerService: CustomerService;


  beforeEach(async(() => {
    customerService = new CustomerService(null);

    component = new CollectionWidgetComponent(null, null, null, null, null, customerService, null, null);

    TestBed.configureTestingModule({
      declarations: [CollectionWidgetComponent, PagingComponent],
      imports: [MaterialModule, BrowserAnimationsModule, FormsModule, MyDatePickerModule, SelectModule],
      providers: [HttpClient, MockBackend, BaseRequestOptions, LocationDashboardService, ScheduleCollectionService,
        ScheduleCollectionService, DateutilService, LocationService, CustomerService, LocationGroupService,
        {
          provide: Http, HttpClient,
          useFactory: (mockBackend, options) => {
            return new Http(mockBackend, options);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        { provide: AuthService, useClass: MockAuthService }
      ]
    })
      .compileComponents();
    fixture = TestBed.createComponent(CollectionWidgetComponent);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
