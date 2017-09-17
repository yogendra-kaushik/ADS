/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';

import { Injectable } from '@angular/core';
import { AppModule } from '../../app.module';
import { NavigationService } from '../navigation.service';
import { Title, BrowserModule } from '@angular/platform-browser';
import { AuthService } from '../../shared/services/auth.service';
import { TopnavComponent } from './topnav.component';
import { SearchService } from 'app/shared/services/search.service';
import { CustomerService } from 'app/shared/services/customer.service';
import { Router, RouterModule } from '@angular/router';
import { NavigationModule } from 'app/navigation/navigation.module';
import { MaterialModule, MdDialog } from '@angular/material';
import { HttpClient } from 'app/shared/services/http-client';
import { Http, BaseRequestOptions, HttpModule } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { ComponentFixture } from '@angular/core/testing';
import { AdalService } from 'ng2-adal/services/adal.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_BASE_HREF } from '@angular/common';
import { LocationDashboardService } from '../../shared/services/location-dashboard.service';
import { LocationGroupService } from '../../shared/services/location-group.service';
import { LocationGroupEditorComponent } from '../../locationdashboard/location-group-editor/location-group-editor.component';
import { LocationService } from 'app/shared/services/location.service';
import { FormsModule } from '@angular/forms';
import { AppConfigOptions } from 'app/app.config.options';


@Injectable()
class MockNavigationService extends NavigationService {
  constructor() {
    super(null, null);
  }
}

@Injectable()
class MockTitle extends Title { }

@Injectable()
class MockAuthService extends AuthService {
  constructor() {
    super(null);
  }

  get user() {
    return {
      name: 'Test User',
      email: 'test@adscore.com',
      id: '1'
    };
  }
  init() {

  }

  login() {
    console.log('AuthService login method called.');
  }

  logout() {
    console.log('AuthService logout method called.');
  }
}

const defaultOptions: AppConfigOptions = {
  appTitle: 'ADS Core',
  openSidenavStyle: 'side',
  closedSidenavStyle: 'icon overlay'
};

describe('TopnavComponent', () => {
  let component: TopnavComponent;
  let fixture: ComponentFixture<TopnavComponent>;
  let mockRouter = {
    navigate: jasmine.createSpy('navigate'),
    events: {
      subscribe: jasmine.createSpy('subscribe')
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      // tslint:disable-next-line:max-line-length
      imports: [MaterialModule, BrowserAnimationsModule, RouterModule, FormsModule],
      declarations: [TopnavComponent],
      providers: [CustomerService, LocationService, LocationDashboardService, LocationGroupService, HttpClient,
        MockBackend, BaseRequestOptions, AdalService, NavigationService, SearchService, Title,
        {
          provide: Http, HttpClient,
          useFactory: (mockBackend, options) => {
            return new Http(mockBackend, options);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        //{ provide: NavigationService, useClass: MockNavigationService },
        //{ provide: Title, useClass: '' },
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: AuthService, useClass: MockAuthService },
        { provide: 'AppConfigOptions', useValue: defaultOptions },
        { provide: Router, useValue: mockRouter }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TopnavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // tslint:disable-next-line:max-line-length
  it('should create the TopnavComponent', inject([NavigationService, SearchService, Title, AuthService, Router, CustomerService, LocationDashboardService, LocationGroupService, MdDialog, LocationService], (navigationService, searchService, title, authService, router, customerService, locationDashboardService, locationGroupService, mdDialog, locationService) => {
    let component = new TopnavComponent(navigationService, searchService, title, authService, router, customerService, locationDashboardService, locationGroupService, mdDialog, locationService);
    expect(component).toBeTruthy();
  }));

  // tslint:disable-next-line:max-line-length
  it('should have user with valid properties', inject([NavigationService, SearchService, Title, AuthService, Router, CustomerService, LocationDashboardService, MdDialog, LocationService], (navigationService, searchService, title, authService, router, customerService, locationDashboardService, locationGroupService, mdDialog, locationService) => {

    // tslint:disable-next-line:max-line-length
    let component = new TopnavComponent(navigationService, searchService, title, authService, router, customerService, locationDashboardService, locationGroupService, mdDialog, locationService);
    let user = component.user;
    expect(user).not.toBe(null);
    expect(user.name).toBe('Test User');
    expect(user.email).toBe('test@adscore.com');
  }));

  // tslint:disable-next-line:max-line-length
  it('should contain login and logout method', inject([NavigationService, SearchService, Title, AuthService, Router, CustomerService, LocationDashboardService, LocationGroupService, MdDialog, LocationService], (navigationService, searchService, title, authService, router, customerService, locationDashboardService, locationGroupService, mdDialog, locationService) => {
    let component = new TopnavComponent(navigationService, searchService, title, authService, router, customerService, locationDashboardService, locationGroupService, mdDialog, locationService);
    expect(component.login).toBeDefined();
    expect(component.logOut).toBeDefined();
  }));
});
