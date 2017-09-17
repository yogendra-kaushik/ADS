import { Component, ElementRef, OnInit, OnDestroy, ViewChild, HostListener } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd } from '@angular/router';
import { MdSidenav } from '@angular/material';

import { Observable, Subscription } from 'rxjs';

import { Angulartics2GoogleAnalytics } from 'angulartics2';
import { NavigationService } from './navigation/navigation.service';
import 'hammerjs';

import { AuthService, Config, PreLoaderService } from './shared/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild(MdSidenav) sideNav: MdSidenav;

  public sidenavStyle = 'side';
  public isHovering = false;

  public isLoading: Observable<boolean>;
  public sidenavOpened = true;
  public _isHoveringNew = false;
  public _isHoveringTimeout: number;
  public _subscriptions: Subscription[] = [];

  public pageTitle: string;

  public customerId = 0;
  public currentRoute: string;

  constructor(
    public _navigation: NavigationService,
    public _router: Router,
    public _elementRef: ElementRef,
    _analytics: Angulartics2GoogleAnalytics,
    public authService: AuthService,
    private preloaderService: PreLoaderService) { }

  ngOnDestroy() {
    this._subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  ngOnInit() {

    // subscribe to the preloader service
    this.isLoading = this.preloaderService.loadingEmitter;

    this._router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {

        this._navigation.setIsRouteLoading(true);

        this._navigation.setBreadcrumbs(null); // Reset breadcrumbs before route change

        this._navigation.setPageTitle(null); // Reset page title before route change

        this.preloaderService.start();
      } else if (event instanceof NavigationEnd) {

        this.currentRoute = (<NavigationEnd>event).urlAfterRedirects;

        this._navigation.setCurrentRoute((<NavigationEnd>event).urlAfterRedirects);

        this._navigation.setIsRouteLoading(true);

        this.preloaderService.stop();

        let routerOutletComponent: HTMLElement = this._elementRef.nativeElement.getElementsByTagName('app-topnav')[0];

        if (routerOutletComponent) {
          routerOutletComponent.scrollIntoView(); // Scroll back to top after route change
        }

      } else if (event['error'] !== undefined) { // reset loading on error

        this.preloaderService.stop();
      }
    });

    this._navigation.pageTitle.subscribe(pageTitle => {
      this.pageTitle = pageTitle;
    });


    if (this._navigation.mediumScreenAndDown) {
      this.sideNav.close();
    }

    let lastWindowSize = 0;
    // tslint:disable-next-line:max-line-length
    let combined = Observable.combineLatest(this._navigation.sidenavOpened, this._navigation.openSidenavStyle, this._navigation.closedSidenavStyle, this._navigation.windowSize, (opened, openStyle, closedStyle, windowSize) => {
      let screenSizeChange = false;
      if (windowSize !== lastWindowSize) {
        lastWindowSize = windowSize;
        screenSizeChange = true;
      }
      return { opened, openStyle, closedStyle, screenSizeChange };
    });

    this._subscriptions.push(
      combined.subscribe((p: {
        opened: boolean,
        openStyle: string,
        closedStyle: string,
        screenSizeChange: boolean
      }) => {
        if (p.openStyle === 'off') {
          this.sidenavOpened = false;
          this.sidenavStyle = 'over';
          this.sideNav.close();
          return;
        }
        this.sidenavOpened = p.opened;
        if (this._navigation.largeScreen) {
          if (p.opened) {
            this.sidenavStyle = p.openStyle;
          } else {
            this.sidenavStyle = p.closedStyle;
          }
          if (this.sidenavStyle !== 'off' && (this.sidenavStyle !== 'hidden' || p.opened) && (this.sidenavStyle !== 'push' || p.opened)) {
            this.sideNav.open();
          } else {
            this.sideNav.close();
          }
        } else {
          if (p.opened) {
            this.sidenavStyle = p.openStyle;
          } else {
            this.sidenavStyle = p.closedStyle;
          }
          if (this.sidenavStyle !== 'off' && (this.sidenavStyle !== 'hidden' || p.opened) && (this.sidenavStyle !== 'push' || p.opened)) {
            this.sideNav.open();
          } else {
            this.sideNav.close();
          }
        }
      }));
    if (this.sidenavStyle === 'hidden' || this.sidenavStyle === 'push') {
      this.sideNav.close(); // Close on initial load
    }
  }

  get isUserAuthenticated() {
    return this.authService.isAuthenticated;
  }

  public get sidenavMode(): string {
    if (this.sidenavStyle === 'icon overlay' && this.isHovering) {
      if (!this._navigation.largeScreen) {
        return 'side';
      } else {
        return 'over';
      }

    } else if (this.sidenavStyle === 'icon' || this.sidenavStyle === 'icon overlay') {
      return 'side';
    } else if (this.sidenavStyle === 'hidden') {
      return 'over';
    } else if (this.sidenavStyle === 'off') {
      return 'over';
    }
    return this.sidenavStyle;
  }

  public sidenavToggle(opened: boolean) {
    this._navigation.setSidenavOpened(opened);
  }

  toggleHover(isHovering: boolean) {
    this._isHoveringNew = isHovering;
    if (isHovering) {
      this.isHovering = true;
    } else if (this._isHoveringTimeout !== 0) {
      this._isHoveringTimeout = window.setTimeout(() => {
        this.isHovering = this._isHoveringNew;
      }, 50);
    }
  }

  @HostListener('window:resize', ['$event'])
  private resize($event) {
    // Need this to trigger change detection for screen size changes!
    this._navigation.updateViewport();
  }
}

