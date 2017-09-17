/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { WelcomeComponent } from './welcome.component';
import { NavigationService } from '../../navigation/navigation.service';
import { ComponentFixture } from '@angular/core/testing';
import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient } from 'app/shared/services/http-client';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http } from '@angular/http';
import { AdalService } from 'ng2-adal/services/adal.service';
import { AuthService } from 'app/shared/services/auth.service';
import { NavigationModule } from 'app/navigation/navigation.module';
import { AppModule } from 'app';
import { APP_BASE_HREF } from '@angular/common';
import { AppConfigOptions } from "app/app.config.options";

@Injectable()
class MockNavigationService extends NavigationService {
  /* constructor() {
     super(null);
   }*/
}

@Injectable()
class MockAuthService extends AuthService {
  constructor() {
    super(null);
  }
  init() {
  }
}

const defaultOptions: AppConfigOptions = {
  appTitle: 'ADS Core',
  openSidenavStyle: 'side',
  closedSidenavStyle: 'icon overlay'
};

describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;
  let navigationService: NavigationService;
  beforeEach(() => {
    component = new WelcomeComponent(navigationService);
    TestBed.configureTestingModule({
      imports: [MaterialModule, BrowserAnimationsModule],
      declarations: [WelcomeComponent],
      providers: [HttpClient, MockBackend, BaseRequestOptions, AdalService, NavigationService,
        {
          provide: Http, HttpClient,
          useFactory: (mockBackend, options) => {
            return new Http(mockBackend, options);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        { provide: AuthService, useClass: MockAuthService },
        { provide: 'AppConfigOptions', useValue: defaultOptions },
        { provide: APP_BASE_HREF, useValue: '/' }
      ]
    })
      .compileComponents();
    fixture = TestBed.createComponent(WelcomeComponent);
    fixture.detectChanges();
  });

  it('should instantiate the component', inject([NavigationService], (navigationService: NavigationService) => {
    expect(component).toBeTruthy();
  }));
});
