import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MockBackend } from '@angular/http/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Injectable } from '@angular/core';
import { BaseRequestOptions, Http } from '@angular/http';
import { MyDatePickerModule } from 'mydatepicker';
import { AutoReviewWidgetComponent } from './auto-review-widget.component';
import { PagingComponent, LoaderComponent } from 'app/shared/components';
import {
  AutoScrubSummaryService, DateutilService, LocationGroupService, LocationService,
  CustomerService, AuthService, HttpClient
} from 'app/shared/services';
import { SelectModule } from 'ng2-select';

@Injectable()
class MockAuthService extends AuthService {
  constructor() {
    super(null);
  }
  init() {
  }
}

describe('AutoReviewComponent', () => {
  let component: AutoReviewWidgetComponent;
  let fixture: ComponentFixture<AutoReviewWidgetComponent>;
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 6000;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AutoReviewWidgetComponent, PagingComponent, LoaderComponent],
      imports: [MaterialModule, BrowserAnimationsModule, FormsModule, MyDatePickerModule, SelectModule],
      providers: [HttpClient,
        MockBackend, BaseRequestOptions, CustomerService, LocationService, AutoScrubSummaryService,
        DateutilService, LocationGroupService,
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
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoReviewWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
