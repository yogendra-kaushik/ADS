import { TestBed, async, inject } from '@angular/core/testing';
import { HttpModule, ResponseOptions, Response, Http, BaseRequestOptions, RequestMethod } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { DailySummaryOverviewResolver } from './daily-summary-overview-resolver.service';
import { DailySummaryReportService } from 'app/pages/report';

import { AuthService } from 'app/shared/services/auth.service';
import { AdalService } from 'ng2-adal/services/adal.service';
import { MaterialModule } from '@angular/material';
import { HttpClient } from 'app/shared/services/http-client';
import { CustomerService } from 'app/shared/services';
import { LocationGroupService } from 'app/shared/services/location-group.service';

describe('DailySummaryReportResolverService', () => {
  beforeEach(() => {
    /*
    TestBed.configureTestingModule({
      providers: [DailySummaryOverviewResolver, HttpClient, DailySummaryReportService]
    });
    */
    TestBed.configureTestingModule({
      imports: [HttpModule, MaterialModule],
      providers: [DailySummaryOverviewResolver, DailySummaryReportService,
        LocationGroupService, CustomerService, HttpClient, AuthService, AdalService, {
          provide: Http, HttpClient,
          useFactory: (mockBackend, options) => {
            return new Http(mockBackend, options);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        MockBackend,
        BaseRequestOptions
      ]
    });
  });

  it('should ...', inject([DailySummaryOverviewResolver], (service: DailySummaryOverviewResolver) => {
    expect(service).toBeTruthy();
  }));
});
