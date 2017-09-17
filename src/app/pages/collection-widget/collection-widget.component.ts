import { Component, OnInit, OnDestroy, ChangeDetectorRef, Inject, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { MdDialog } from '@angular/material';
import { CollectionWidgetScheduleComponent } from '../collection-widget-schedule/collection-widget-schedule.component';
import { LocationDashboardService } from '../../shared/services/location-dashboard.service';
import { Config } from '../../shared/services/config';
import { Locations } from '../../shared/models/locations';
import { ScheduleCollectionService } from '../../shared/services/schedule-collection.service';
import { ScheduleCollection } from '../../shared/models/schedule-collection';
import { CollectionHistory } from '../../shared/models/collection-history';
import { IMyInputFieldChanged, IMyOptions, IMyDate } from 'mydatepicker';
import { DateutilService } from '../../shared/services/dateutil.service';
import { UUID } from 'angular2-uuid';
import { CustomerService } from '../../shared/services';
import { LocationService } from 'app/shared/services/location.service';
import { Subscription } from 'rxjs/Subscription';
import { LocationGroupService } from 'app/shared';
import { SelectItem } from 'app/shared/models';

@Component({
  selector: 'collection-widget',
  templateUrl: './collection-widget.component.html',
  styleUrls: ['./collection-widget.component.scss']
})
export class CollectionWidgetComponent implements OnInit, OnDestroy, OnChanges {
  schedules: ScheduleCollection[];
  @Input() collectionHistory: CollectionHistory[];
  @Input() public locations: Array<Locations>;
  @Input() showCollectionSearch: boolean;
  @Input() showCollectionColumn: boolean;
  @Output() showMap: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() showSearchCollection: EventEmitter<boolean> = new EventEmitter<boolean>();
  isCollecting: boolean;
  startDateValue: string;
  endDateValue: string;
  displayStartDateErrMsg: boolean;
  displayEndDateErrMsg: boolean;
  invalidDateRange: boolean;
  invalidStartDate: boolean;
  invalidEndDate: boolean;
  pagedItems: CollectionHistory[];
  showPagination = true;
  uuid: UUID;
  disableSchedule: boolean;
  private subscriptions = new Array<Subscription>();
  startDateValidity: boolean;
  endDateValidity: boolean;
  collectionWidgetLoadingState: boolean;


  startDate: any = { date: { year: (new Date()).getFullYear(), month: this.getPreviousMonth(), day: this.getDay() } };
  endDate: any = { date: { year: (new Date()).getFullYear(), month: (new Date()).getMonth() + 1, day: (new Date()).getDate() } };

  public myDatePickerOptions: IMyOptions = {
    dateFormat: 'mm/dd/yyyy',
    disableSince: <IMyDate>{ year: (new Date()).getFullYear(), month: (new Date()).getMonth() + 1, day: (new Date()).getDate() + 1 },
  };

  // display selected location using searching
  private selectedLocation: SelectItem[] = [];
  private filteredLocations: Array<SelectItem> = [];

  getDay() {
    let date = new Date();
    date.setDate(date.getDate() - 1);
    return date.getDate();
  }

  getPreviousMonth() {
    let date = new Date();
    date.setDate(date.getDate() - 1);
    return (date.getMonth() + 1);
  }

  constructor(private locationDashboardService: LocationDashboardService, private scheduleCollectionService: ScheduleCollectionService,
    private _dialog: MdDialog, private dateutilService: DateutilService,
    private cdr: ChangeDetectorRef, private customerService: CustomerService,
    private locationService: LocationService, private locationGroupService: LocationGroupService) {
    this.subscriptions.push(this.customerService.customerChange.subscribe(customerID => this.onCustomerChange(customerID)));
    this.subscriptions.push(this.locationGroupService.locationGroupChange.subscribe(() =>
      this.onLocationGroupChange()));
  }

  ngOnInit() {
    this.uuid = UUID.UUID();
  }

  ngOnChanges() {
    this.filteredLocations = [];
    this.populateFilterLocations();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  onCustomerChange(customerID) {
    this.hideCollectionSearchPanel();
    this.resetCollectionParameters();
  }

  scheduleCollection() {
    this.disableSchedule = true;
    this.collectionWidgetLoadingState = true;
    let subscripton = this.scheduleCollectionService.getScheduleCollection(this.customerService.customerId).subscribe(
      result => {
        this.schedules = result.schedules;
        this.collectionWidgetLoadingState = false;
        this._dialog.open(CollectionWidgetScheduleComponent, {
          disableClose: true,
          data: {
            locations: this.locations,
            schedules: this.schedules
          }
        }).afterClosed().subscribe(res => {
          this.loadScheduleCollection();
          this.loadLocations();
          this.disableSchedule = false;
        });
      }, error => this.collectionWidgetLoadingState = false
    );
    this.subscriptions.push(subscripton);
  }

  loadLocations() {
    // get the location for selected customers.
    let subscripton = this.locationDashboardService.getLocations(this.customerService.customerId).subscribe(
      res => this.locations = res
    );
    this.subscriptions.push(subscripton);
  }
  loadScheduleCollection() {
    let subscription = this.scheduleCollectionService.getScheduleCollection(this.customerService.customerId).subscribe(
      result => {
        this.schedules = result.schedules;
      },
      error => this.handleError(error)
    );
    this.subscriptions.push(subscription);
  }

  handleError(error: any) {
    this.schedules = [];
  }

  collectHistory() {
    this.isCollecting = true;
    let locationIds: number[] = [];
    locationIds = this.collectionHistory.map(element => element.locationid);
    let collectStartDate: any = { date: { year: (new Date()).getFullYear(), month: this.getPreviousMonth(), day: this.getDay() } };
    let collectEndDate: any = {
      date: {
        month: (new Date).getMonth() + 1, day: (new Date).getDate(), year: (new Date).getFullYear()
      }
    };

    let subscription = this.scheduleCollectionService.
      getCollectionHistory(this.customerService.customerId, this.locationGroupService.locationGroupID, locationIds,
      this.dateutilService.formatStartDate(collectStartDate), this.dateutilService.formatEndDate(collectEndDate)).subscribe(
      result => {
        this.collectionHistory = result;
        this.scheduleCollectionService.collectionHistory = this.collectionHistory;
        if (this.collectionHistory !== undefined && this.collectionHistory !== null && this.collectionHistory.length > 10) {
          this.showPagination = false;
        } else {
          this.showPagination = true;
        }
        this.isCollecting = false;
      }
      );
    this.subscriptions.push(subscription);
  }

  getCollectionDetails() {
    this.collectionWidgetLoadingState = true;
    // Filter Location Ids from Selected Locations
    let locationIds: number[] = [];
    locationIds = this.selectedLocation.map(element => element.id);

    let subscription = this.scheduleCollectionService.getCollectionHistory(this.customerService.customerId,
      this.locationGroupService.locationGroupID, locationIds, this.dateutilService.formatStartDate(this.startDate),
      this.dateutilService.formatEndDate(this.endDate)).subscribe(res => {
        this.collectionHistory = res;
        this.collectionWidgetLoadingState = false;
        this.scheduleCollectionService.collectionHistory = this.collectionHistory;
        this.showCollectionColumn = true;
        this.showMap.emit(false);
        this.showSearchCollection.emit(false);
        if (this.collectionHistory !== undefined && this.collectionHistory !== null && this.collectionHistory.length > 10) {
          this.showPagination = false;
        } else {
          this.showPagination = true;
        }
      }, error => this.collectionWidgetLoadingState = false);
    this.subscriptions.push(subscription);
  }

  showPageRecords(pagedItems: CollectionHistory[]) {
    this.pagedItems = pagedItems;
    this.cdr.detectChanges();
  }

  getMarkerLocationDetails(locationId: number) {
    this.locationService.locationId = locationId;
  }

  onStartDateChanged(event: IMyInputFieldChanged) {
    this.startDateValidity = event.valid;
    this.startDateValue = event.value;
    if (this.startDateValue === '') {
      this.displayStartDateErrMsg = true;
    } else {
      this.displayStartDateErrMsg = false;
    }

    if ((event.valid === false && this.startDateValue !== '') ||
      (this.endDateValue !== undefined && this.startDateValue !== undefined &&
        this.endDateValue.length === 10 && this.startDateValue.length === 10 &&
        (new Date(this.endDateValue)).getTime() < (new Date(event.value)).getTime())) {
      this.invalidStartDate = true;
    } else {
      this.invalidStartDate = false;
    }

    if (this.endDateValidity) {
      this.invalidEndDate = false;
    } else if (this.endDateValue !== undefined && this.endDateValue !== '' && this.endDateValue.length !== 10) {
      this.invalidEndDate = true;
    }
    this.monthDifference(this.startDateValue, this.endDateValue);
  }

  onEndDateChanged(event: IMyInputFieldChanged) {
    this.endDateValidity = event.valid;
    this.endDateValue = event.value;
    if (this.endDateValue === '') {
      this.displayEndDateErrMsg = true;
    } else {
      this.displayEndDateErrMsg = false;
    }

    if ((event.valid === false && this.endDateValue !== '') ||
      (this.endDateValue !== undefined && this.startDateValue !== undefined &&
        this.endDateValue.length === 10 && this.startDateValue.length === 10 &&
        (new Date(event.value)).getTime() < (new Date(this.startDateValue)).getTime())) {
      this.invalidEndDate = true;
    } else {
      this.invalidEndDate = false;
    }
    if (this.startDateValidity) {
      this.invalidStartDate = false;
    } else if (this.startDateValue !== undefined && this.startDateValue !== '' && this.startDateValue.length !== 10) {
      this.invalidStartDate = true;
    }
    this.monthDifference(this.startDateValue, this.endDateValue);
  }

  monthDifference(startDateValue, endDateValue) {
    let startDate = new Date(startDateValue);
    let endDate = new Date(endDateValue);
    let timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
    let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (diffDays > 30 && !(this.invalidStartDate || this.invalidEndDate) && this.startDateValue.length === 10) {
      this.invalidDateRange = true;
    } else {
      this.invalidDateRange = false;
    }
  }

  hideCollectionSearchPanel() {
    this.showCollectionSearch = false;
    this.showSearchCollection.emit(false);
  }

  resetCollectionParameters() {
    this.selectedLocation = [];
    this.startDate = { date: { year: (new Date()).getFullYear(), month: this.getPreviousMonth(), day: this.getDay() } };
    this.endDate = { date: { year: (new Date()).getFullYear(), month: (new Date()).getMonth() + 1, day: (new Date()).getDate() } };
  }

  // Refresh selected location value while removing from searching text field
  public removed(location: SelectItem): void {
    this.selectedLocation = this.selectedLocation.filter(x => x.id !== location.id);
  }

  // Refresh selected location value while searching from searching text field
  public refreshValue(locations: SelectItem[]): void {
    for (let location of locations) {
      if (!this.locationService.containsLocation(location, this.selectedLocation)) {
        this.selectedLocation.push(location);
      }
    }
  }

  // populate data from locations array to filteredLocations
  private populateFilterLocations() {
    this.locations.forEach((location: { locationId: number, locationName: string }) => {
      this.filteredLocations.push({
        id: location.locationId,
        text: location.locationName
      });
    });
  }

  private onLocationGroupChange() {
    this.hideCollectionSearchPanel();
    this.resetCollectionParameters();
  }
}



