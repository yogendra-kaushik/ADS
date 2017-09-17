import { TestBed, inject } from '@angular/core/testing';
import { AlarmService } from './alarm.service';
import { MaterialModule } from '@angular/material';
import { HttpClient } from '../../shared/services/http-client';
import { Http, BaseRequestOptions, HttpModule } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { AuthService } from '../../shared/services/auth.service';
import { Injectable } from '@angular/core';

@Injectable()
class MockAuthService extends AuthService {
  constructor() {
    super(null);
  }
  init() {
  }
}

describe('AlarmService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, MaterialModule],
      providers: [AlarmService, HttpClient, {
        provide: Http, HttpClient,
        useFactory: (mockBackend, options) => {
          return new Http(mockBackend, options);
        },
        deps: [MockBackend, BaseRequestOptions]
      },
        MockBackend,
        BaseRequestOptions,
        { provide: AuthService, useClass: MockAuthService }
      ]
    });
  });

  it('should ...', inject([AlarmService], (service: AlarmService) => {
    expect(service).toBeTruthy();
  }));
});
