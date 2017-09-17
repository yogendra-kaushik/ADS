import { TestBed, inject } from '@angular/core/testing';
import { LocationGroupService } from './location-group.service';
import { HttpClient } from 'app/shared/services/http-client';
import { Http, BaseRequestOptions, HttpModule } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { MaterialModule } from '@angular/material';
import { AppModule } from 'app';
import { APP_BASE_HREF } from '@angular/common';
import { AuthService } from 'app/shared';
import { Injectable } from '@angular/core';

@Injectable()
class MockAuthService extends AuthService {
  constructor() {
    super(null);
  }
  init() {
  }
}

describe('LocationGroupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, MaterialModule],
      providers: [LocationGroupService, HttpClient,
        {
          provide: Http, HttpClient,
          useFactory: (mockBackend, options) => {
            return new Http(mockBackend, options);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        { provide: AuthService, useClass: MockAuthService },
        { provide: APP_BASE_HREF, useValue: '/' },
        MockBackend,
        BaseRequestOptions
      ]
    });
  });

  it('should ...', inject([LocationGroupService], (service: LocationGroupService) => {
    expect(service).toBeTruthy();
  }));
});
