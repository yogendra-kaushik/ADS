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
import { LocationService } from './location.service';

describe('LocationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, MaterialModule],
      // tslint:disable-next-line:max-line-length
      providers: [LocationService, HttpClient, AuthService, AdalService,
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

  it('should be created', inject([LocationService], (service: LocationService) => {
    expect(service).toBeTruthy();
  }));
});
