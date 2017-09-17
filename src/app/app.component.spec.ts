/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { AuthService } from './shared/services/auth.service';
import { FormsModule } from '@angular/forms';
import { HttpModule, BaseRequestOptions, Http } from '@angular/http';
import { routing } from 'app/app.routing';
import { MockBackend } from '@angular/http/testing';
import { APP_BASE_HREF } from '@angular/common';
import { AppConfigOptions } from 'app/app.config.options';
import { ComponentFixture } from '@angular/core/testing';
import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidenavComponent } from 'app/navigation/sidenav/sidenav.component';
import { TopnavComponent } from 'app/navigation/topnav/topnav.component';
import { FooterComponent } from 'app/navigation/footer/footer.component';
import { RouterModule, Router } from '@angular/router';
import { SidenavItemComponent } from 'app/navigation/sidenav/sidenav-item/sidenav-item.component';
import { AdalService } from 'ng2-adal/services/adal.service';
import { NavigationService } from 'app/navigation/navigation.service';
import { Title } from '@angular/platform-browser';
import { Angulartics2GoogleAnalytics, Angulartics2 } from 'angulartics2/dist';
import { Location, LocationStrategy } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { LocationService } from 'app/shared/services/location.service';
import { LocationGroupService } from 'app/shared/services/location-group.service';
import { ViewDataService } from 'app/shared/services/view-data.service';
import { CollectService } from 'app/shared/services/collect.service';
import { LocationDashboardService } from 'app/shared/services/location-dashboard.service';
import { ScheduleCollectionService } from 'app/shared/services/schedule-collection.service';
import { CustomerService } from 'app/shared/services/customer.service';
import { HttpClient } from 'app/shared/services/http-client';
import { PreLoaderService } from 'app/shared/services/pre-loader.service';
import { CrowdCoreService } from 'app/shared/services/crowd-core';
import { DateutilService } from 'app/shared/services/dateutil.service';
import { BatteryStatusService } from 'app/shared/services/battery-status.service';
import { AutoScrubSummaryService } from 'app/shared/services/auto-scrub-summary.service';
import { AlarmService } from 'app/shared/services/alarm.service';
import { BlockagePredictionService } from 'app/shared/services/blockage-prediction.service';
import { SearchService } from 'app/shared/services/search.service';

@Injectable()
class MockAuthService extends AuthService {
  constructor() {
    super(null);
  }
  init() {
  }

  login() {

  }
  logout() {

  }
}

const defaultOptions: AppConfigOptions = {
  appTitle: 'ADS Core',
  openSidenavStyle: 'side',
  closedSidenavStyle: 'icon overlay'
};

@Injectable()
class MockNavigationService extends NavigationService {
  constructor() {
    super(null, null);
  }
  public get appTitle(): any {
    return 'ADS Core';
  }
}

@Injectable()
class MockTitle extends Title {
  constructor() {
    super(null);
  }
  setTitle(title) {

  }
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockRouter = {
    navigate: jasmine.createSpy('navigate'),
    events: {
      subscribe: jasmine.createSpy('subscribe')
    }
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule, BrowserAnimationsModule, RouterModule, FormsModule
        , RouterTestingModule.withRoutes([
          { path: '', component: AppComponent }
        ])],
      declarations: [AppComponent, SidenavComponent, TopnavComponent, FooterComponent, SidenavItemComponent],
      providers: [MockBackend, BaseRequestOptions, NavigationService, Angulartics2GoogleAnalytics,
        Angulartics2, AdalService, Location, PreLoaderService, HttpClient, CrowdCoreService,
        CustomerService, LocationService, LocationGroupService, DateutilService,
        LocationDashboardService, BatteryStatusService, AutoScrubSummaryService,
        ScheduleCollectionService, AlarmService, BlockagePredictionService, SearchService, ViewDataService,
        {
          provide: Http, HttpClient,
          useFactory: (mockBackend, options) => {
            return new Http(mockBackend, options);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        { provide: AuthService, useClass: MockAuthService },
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: Title, useClass: MockTitle },
        { provide: 'AppConfigOptions', useValue: defaultOptions }]
    });
    TestBed.compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create the app', inject([AuthService], (authService: AuthService) => {
  //   expect(component).toBeTruthy();
  // }));

  // it(`should have a router outlet`, async(() => {
  //   let app = fixture.debugElement.componentInstance;
  //   expect(app._navigation.pageTitle.value).toEqual('ADS Core');
  // }));

  // it('should contain a top nav', async(() => {
  //   let compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('app-topnav').textContent).toBeDefined();
  // }));
});
