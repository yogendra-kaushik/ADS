/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, Injectable } from '@angular/core';

import { AutoScrubSummaryComponent } from './auto-scrub-summary.component';
import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient } from 'app/shared/services/http-client';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http } from '@angular/http';
import { AuthService } from 'app/shared/services/auth.service';
import { ChartModule } from 'angular2-highcharts';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
import { highchartsFactory } from 'app';
import { FormsModule } from '@angular/forms';
import { MyDatePickerModule } from 'mydatepicker';

@Injectable()
class MockAuthService extends AuthService {
  constructor() {
    super(null);
  }
  init() {
  }
}

describe('AutoScrubSummaryComponent', () => {
  let component: AutoScrubSummaryComponent;
  let fixture: ComponentFixture<AutoScrubSummaryComponent>;
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 6000;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AutoScrubSummaryComponent],
      imports: [MaterialModule, BrowserAnimationsModule, ChartModule, FormsModule, MyDatePickerModule],
      providers: [HttpClient, MockBackend, BaseRequestOptions,
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
    fixture = TestBed.createComponent(AutoScrubSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
