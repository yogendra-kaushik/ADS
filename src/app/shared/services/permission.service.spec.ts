/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PermissionService } from './permission.service';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { HttpModule, ResponseOptions, Response, Http, BaseRequestOptions, RequestMethod } from '@angular/http';
import { HttpClient } from './http-client';
import { AuthService } from './auth.service';
import { AdalService } from 'ng2-adal/services/adal.service';
import { MaterialModule } from '@angular/material';

describe('PermissionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, MaterialModule ],
      // tslint:disable-next-line:max-line-length
      providers: [PermissionService, HttpClient, AuthService, AdalService,
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
  describe('getPermissions()', () => {
  it('should create instance of ...', inject([PermissionService], (service: PermissionService) => {
    expect(service).toBeTruthy();
  }));
    });
});

