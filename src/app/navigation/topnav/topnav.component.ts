import { Component, OnInit, EventEmitter, Output, OnDestroy, QueryList } from '@angular/core';
import { MdSidenav, MdDialog } from '@angular/material';
import { Input, OnChanges } from '@angular/core';
import { NavigationService } from '../navigation.service';
import { Title } from '@angular/platform-browser';
import { StringUtils } from '../../shared/utils/string-utils';
import { AuthService } from '../../shared/services/auth.service';
import { Config } from '../../shared/services/config';
import { CustomerService } from '../../shared/services/customer.service';
import { Customer } from '../../shared/models/customer';
import { User } from '../../shared/models/user';
import { SearchService } from '../../shared/services/search.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { LocationGroup } from 'app/shared/models/location-group';
import { Locations } from 'app/shared/models/locations';
import { LocationDashboardService } from '../../shared/services/location-dashboard.service';
import { LocationGroupService } from '../../shared/services/location-group.service';
import { LocationGroupEditorComponent } from '../../locationdashboard/location-group-editor/location-group-editor.component';
import { UserPreferencesComponent } from 'app/pages/user-preferences/user-preferences.component';
import { CustomerEditorComponent } from 'app/pages/customer-editor/customer-editor.component';
import { LocationService } from 'app/shared/services/location.service';
import { ContactUsComponent, AssistanceCenterComponent } from 'app/shared/components';


@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.scss']
})
export class TopnavComponent implements OnInit, OnDestroy, OnChanges {
  isLoadingRoute = false;
  sidenavOpenStyle: string;
  pageTitle: string;
  breadcrumbs: Array<{ title: string, link: any[] | string }> = [];
  autoBreadcrumbs = true;
  searchToggled = false;

  private _sidenavOpened: boolean;
  public sidenavStyle: string;
  private _browserTitle: string;
  private _searchTerm = '';

  private _breadcrumbInterval: number;
  private _pageTitleInterval: number;
  private _subscriptions: Subscription[] = [];

  locationGroupID: number;
  customerId: number;
  customers: Customer[] = [];
  @Input() currentRoute: any;
  locationGroups: LocationGroup[] = [];
  locations: Locations;
  locationsIDs: number[];

  constructor(public navigation: NavigationService,
    public search: SearchService,
    private _title: Title,
    private authService: AuthService,
    private router: Router,
    private customerService: CustomerService,
    private locationDashboardService: LocationDashboardService,
    private locationGroupService: LocationGroupService,
    private _dialog: MdDialog,
    private locationService: LocationService) {
    this.router.events.subscribe((event) => {
      this.updatePageTitle();
    })
  }

  // to check if user is on welcome page or not
  get isCurrentPageHome() {
    return window.location.pathname.toString().toLowerCase().search('welcome') >= 0 ? true : false;
  }

  get user() {
    return this.authService.user;
  }

  login() {
    this.authService.login();
  }

  logOut() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this._subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  ngOnChanges() {
    this.updatePageTitle();
  }
  public contactUs() {
    this._dialog.open(ContactUsComponent, {
      disableClose: true,
      data: {
      }
    });
  }
  public AssistanceCenter(selectedTab: string, selectedTabName: string) {
    this._dialog.open(AssistanceCenterComponent, {
      disableClose: true,
      data: {
        selectedTab: selectedTab,
        selectedTabName: selectedTabName
      }
    });
  }
  ngOnInit() {
    this._subscriptions.push(this.navigation.openSidenavStyle.subscribe(style => {
      this.sidenavOpenStyle = style;
    }));
    this._subscriptions.push(this.navigation.isRouteLoading.subscribe(isRouteLoading => {
      this.isLoadingRoute = isRouteLoading;
    }));
    this._subscriptions.push(this.navigation.sidenavOpened.subscribe(sidenavOpen => {
      this._sidenavOpened = sidenavOpen;
    }));
    this._subscriptions.push(this.navigation.menuItems.subscribe(items => {
      if (this.autoBreadcrumbs) {
        this.updateAutoBreadcrumbs();
      }
      this.updatePageTitle();
    }));
    this._subscriptions.push(this.navigation.breadcrumbs.subscribe(breadcrumbs => {
      if (breadcrumbs !== null) {
        window.clearInterval(this._breadcrumbInterval);
        this.autoBreadcrumbs = false;
        this.breadcrumbs = breadcrumbs;
      } else {
        if (this.isLoadingRoute) {
          this._breadcrumbInterval = window.setInterval(() => {
            if (!this.isLoadingRoute) {
              window.clearInterval(this._breadcrumbInterval);
              this.updateAutoBreadcrumbs();
            }
          });
        } else {
          this.updateAutoBreadcrumbs();
        }
      }
    }));
    this._subscriptions.push(this.navigation.pageTitle.subscribe(pageTitle => {
      if (pageTitle !== null) {
        window.clearInterval(this._pageTitleInterval);
        this.pageTitle = pageTitle;
        if (this._browserTitle === null) {
          this._title.setTitle(this.navigation.getAutoBrowserTitle(pageTitle));
        }
      } else {
        if (this.isLoadingRoute) {
          this._pageTitleInterval = window.setInterval(() => {
            if (!this.isLoadingRoute) {
              window.clearInterval(this._pageTitleInterval);
              this.updatePageTitle();
            }
          });
        } else {
          this.updatePageTitle();
        }
      }
    }));
    this._subscriptions.push(this.navigation.browserTitle.subscribe(browserTitle => {
      this._browserTitle = browserTitle;
      if (browserTitle !== null) {
        this._title.setTitle(browserTitle);
      } else {
        this._title.setTitle(this.navigation.getAutoBrowserTitle(this.pageTitle));
      }
    }));

    this.customerService.getCustomers(true).subscribe(res => {
      if (res === undefined) {

      } else {
        this.customers = res;
        this.customerId = this.customers[0].customerID;
        this.onCustomerChange(this.customers[0].customerID);
      }
    });
    this.locationGroupID = 0;
  }

  get searchTerm(): string {
    return this._searchTerm;
  }

  set searchTerm(searchTerm: string) {
    this._searchTerm = searchTerm;
    this.search.updateSearchTerm(searchTerm);
  }

  onChangeLocationGroup(locationGroupID: any) {
    this.locationGroupService.locationGroupID = locationGroupID;
    this.locationDashboardService.getLocations(this.customerId, locationGroupID).subscribe(
      res => {
        let temp = [];
        res.forEach(loc => {
          temp.push(loc.locationId);
        });
        this.locationService.locationIDs = temp;
      });
  }

  onCustomerChange(value: number) {
    this.locationGroupService.locationGroupID = 0;
    this.locationService.locationIDs = [];
    this.customerId = value;
    this.customerService.customerId = value;
    // Added for location and locationGroup.
    this.locationGroups = null;
    this.locationGroupID = 0;
    // initializing location-group drop-down.
    let subscription1 = this.locationGroupService.getLocationGroups(this.customerId).subscribe(res => {
      if (res === undefined) {

      } else {
        this.locationGroups = res.locationGroups;
      }
    });
    this._subscriptions.push(subscription1);
    // get the location for selected customers.
    let subscription2 = this.locationDashboardService.getLocations(this.customerId).subscribe(
      res => {
        this.locations = res;
      }
    );
    this._subscriptions.push(subscription2);
  }

  // open location group editor pop up
  openLocationGroup() {
    this._dialog.open(LocationGroupEditorComponent, {
      disableClose: true,
      data: {
        locations: this.locations,
        locationGroups: this.locationGroups
      }
    }).afterClosed().subscribe(res => {
      this.loadLocationGroups();
    });
  }
  // open User Preferences editor pop up
  openUserPreferences() {
    this._dialog.open(UserPreferencesComponent, {
      disableClose: true,
      data: {
        user: this.user.name
      }
    }).afterClosed().subscribe(res => {
      // this.loadLocationGroups();
    });
  }
  openCustomerEditor() {
    this._dialog.open(CustomerEditorComponent, {
      disableClose: true,
      data: {
      }
    }).afterClosed().subscribe(res => {
      // this.loadLocationGroups();
    });
  }
  loadLocationGroups() {
    let subscription = this.locationGroupService.getLocationGroups(this.customerService.customerId).subscribe(
      result => {
        this.locationGroups = result.locationGroups;
      },
      error => this.handleError(error)
    );
    this._subscriptions.push(subscription);
  }
  handleError(error: any) {
    this.locationGroups = [];
  }

  toggleSidenav() {
    this.navigation.setSidenavOpened(!this._sidenavOpened);
  }

  toggleSearch(input: HTMLInputElement) {
    this.searchToggled = !this.searchToggled;
    if (this.searchToggled) {
      window.setTimeout(() => {
        input.focus();
      }, 0);
    }
  }

  searchBlur() {
    if (StringUtils.isEmpty(this.searchTerm)) {
      this.searchToggled = false;
    }
  }

  private updateAutoBreadcrumbs() {
    this.navigation.currentRoute.take(1).subscribe(currentRoute => {
      this.autoBreadcrumbs = true;
      this.breadcrumbs = this.navigation.getAutoBreadcrumbs(currentRoute);
    });
  }

  private updatePageTitle() {
    this.navigation.currentRoute.take(1).subscribe(currentRoute => {
      this.pageTitle = this.navigation.getAutoPageTitle(currentRoute);
      if (this._browserTitle === null) {
        this._title.setTitle(this.navigation.getAutoBrowserTitle(this.pageTitle));
      }
    });
  }
}
