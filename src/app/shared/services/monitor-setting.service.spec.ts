import { TestBed, async, inject } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { HttpModule, ResponseOptions, Response, Http, BaseRequestOptions, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs';
import { AdalService } from 'ng2-adal/services/adal.service';
import { MaterialModule } from '@angular/material';
import { Config } from './config';
import { HttpClient } from './http-client';
import { AuthService } from './auth.service';
import { MonitorSettingService } from './monitor-setting.service';

fdescribe('MonitorSettingService', () => {
  beforeEach(() => {
    let customerId = 63;
    let locationid = 105;
    let serialnumber = '9102';
    let ipaddress = '166.219.172.234';

    TestBed.configureTestingModule({
      imports: [HttpModule, MaterialModule],
      providers: [MonitorSettingService, HttpClient, AuthService, AdalService,
        {
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

  it('should be created', inject([MonitorSettingService], (service: MonitorSettingService) => {
    expect(service).toBeTruthy();
  }));

  it('should return an response',
    inject([MonitorSettingService, MockBackend], (monitorSettingService, mockBackend) => {
      const mockResponse = {
        'responseMessage': 'TestLocation activated successfully'
      };
      mockBackend.connections.subscribe((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponse)
        })));
      });
      monitorSettingService.activateLocation(this.customerId, this.locationid, this.serialnumber, this.ipaddress)
        .subscribe((responseActivateLocation) => {
          expect(responseActivateLocation.responseMessage).toBe('TestLocation activated successfully');
        });
    }));

  it('should return an response',
    inject([MonitorSettingService, MockBackend], (monitorSettingService, mockBackend) => {
      const mockResponseRetry = {
        'retry': 3
      };

      mockBackend.connections.retry((connection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(mockResponseRetry)
        })));
      });

      monitorSettingService.activateLocation(this.customerId, this.locationid, this.serialnumber, this.ipaddress)
        .retry((responseActivateLocationRetry) => {
          expect(responseActivateLocationRetry.retry).toBe(3);
        });
    }));
});
