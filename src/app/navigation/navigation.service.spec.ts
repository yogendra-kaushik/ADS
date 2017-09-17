/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NavigationService } from './navigation.service';
import { HttpModule, BaseRequestOptions, Http } from '@angular/http';
import { MaterialModule, MdDialog } from '@angular/material';
import { MockBackend } from '@angular/http/testing';
import { HttpClient } from 'app/shared/services/http-client';
import { AuthService } from 'app/shared/services/auth.service';
import { AdalService } from 'ng2-adal/services/adal.service';
import { NavigationModule } from 'app/navigation/navigation.module';

describe('Service: Navigation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, MaterialModule, NavigationModule],
      providers: [NavigationService, HttpClient, AuthService, AdalService, MdDialog, {
        provide: Http, HttpClient,
        useFactory: (mockBackend, options) => {
          return new Http(mockBackend, options);
        },
        deps: [MockBackend, BaseRequestOptions]
      },
        { provide: 'AppConfigOptions', useValue: '' },
        MockBackend,
        BaseRequestOptions
      ]
    });
  });

  it('should ...', inject([NavigationService], (service: NavigationService) => {
    expect(service).toBeTruthy();
  }));
});
