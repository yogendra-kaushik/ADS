import { Component, OnInit, Input, EventEmitter, Output, ChangeDetectorRef, OnDestroy, OnChanges } from '@angular/core';
import { IMyOptions, IMyDateModel, IMyInputFieldChanged, IMyDate } from 'mydatepicker';
import { AutoScrubSummary, Locations, SelectItem } from 'app/shared/models';
import { OrderByPipe } from 'app/shared/pipes/order-by-pipe';
import { UUID } from 'angular2-uuid';
import { Sort, MdDialog } from '@angular/material';
import * as Highcharts from 'Highcharts';
import { AlarmGraphComponent } from 'app/pages/alarm-graph/alarm-graph.component';
import { Subscription } from 'rxjs/Subscription';
import {
  CustomerService, LocationService, LocationGroupService, DateutilService, ColorBrewer,
  AutoScrubSummaryService
} from 'app/shared/services';

@Component({
  selector: 'app-auto-review-widget',
  templateUrl: './auto-review-widget.component.html',
  styleUrls: ['./auto-review-widget.component.scss']
})
export class AutoReviewWidgetComponent implements OnInit, OnDestroy, OnChanges {
  @Input() public autoScrubSummaryDetails: Array<AutoScrubSummary>;
  @Input() public locations: Array<Locations>;
  @Input() public showAutoReviwSearch: boolean;
  @Output() public showMap: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() public showSearchAutoReviw: EventEmitter<boolean> = new EventEmitter<boolean>();
  public uuid: UUID;
  public errThresholds: object;
  public selectedThreshold: number;
  private customerId: number;
  private startDateValue: string;
  private endDateValue: string;
  public displayStartDateErrMsg: boolean;
  public displayEndDateErrMsg: boolean;
  public invalidDateRange: boolean;
  public invalidStartDate: boolean;
  public invalidEndDate: boolean;
  public setFirstPage = true;

  public pagedItems: Array<AutoScrubSummary>;
  public startDate: any = { date: { year: (new Date()).getFullYear(), month: this.getPreviousMonth(), day: this.getDay() } };
  public endDate: any = { date: { year: (new Date()).getFullYear(), month: (new Date()).getMonth() + 1, day: (new Date()).getDate() } };

  // display selected location using searching
  private selectedLocation: Array<SelectItem> = [];
  private filteredLocations: Array<SelectItem> = [];

  public myDatePickerOptions: IMyOptions = {
    dateFormat: 'mm/dd/yyyy',
    disableSince: <IMyDate>{ year: (new Date()).getFullYear(), month: (new Date()).getMonth() + 1, day: (new Date()).getDate() + 1 },
  };
  private endDateValidity: boolean;
  private startDateValidity: boolean;
  public autoReviewWidgetLoadingState: boolean;
  private subscriptions = new Array<Subscription>();


  private getDay() {
    let date = new Date();
    date.setDate(date.getDate() - 1);
    return date.getDate();
  }

  private getPreviousMonth() {
    let date = new Date();
    date.setDate(date.getDate() - 1);
    return (date.getMonth() + 1);
  }

  constructor(private autoScrubSummaryService: AutoScrubSummaryService,
    private dateutilService: DateutilService, private cdr: ChangeDetectorRef,
    private _dialog: MdDialog,
    private customerService: CustomerService,
    private locationService: LocationService,
    private locationGroupService: LocationGroupService) {
    this.subscriptions.push(this.customerService.customerChange.subscribe(customerID => this.onCustomerChange(customerID)));
    this.subscriptions.push(this.locationGroupService.locationGroupChange.subscribe(() =>
      this.onLocationGroupChange()));
  }

  ngOnInit() {
    this.uuid = UUID.UUID();
    this.errThresholds = [
      { value: '10', text: '>5%' }
    ];
    this.selectedThreshold = this.errThresholds[0].value;
  }

  ngOnChanges() {
    this.filteredLocations = [];
    this.populateFilterLocations();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  public sortData(sort: Sort) {
    const data = this.autoScrubSummaryDetails.slice();
    if (!sort.active || sort.direction === '') {
      this.autoScrubSummaryDetails = data;
      return;
    }

    this.autoScrubSummaryDetails = data.sort((a, b) => {
      let isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'Location': return compare(a.locationName, b.locationName, isAsc);
        case 'Date': return compare(a.aDate, b.aDate, isAsc);
        case 'Status': return compare(a.displayStatus, b.displayStatus, isAsc);
        case 'Error': return compare((a.anomalyPercentage * 10), (b.anomalyPercentage * 10), isAsc);
        default: return 0;
      }
    });
  }

  public getAutoDetectDetails() {
    this.autoReviewWidgetLoadingState = true;
    this.customerId = this.customerService.customerId;

    // Filter Location Ids from Selected Locations
    let locationIds: number[] = [];
    locationIds = this.selectedLocation.map(element => element.id);

    let subscription = this.autoScrubSummaryService.getAutoScrubSummary(locationIds, this.customerId,
      this.dateutilService.formatStartDate(this.startDate), this.dateutilService.formatEndDate(this.endDate),
      this.selectedThreshold, this.locationGroupService.locationGroupID).subscribe(res => {
        this.autoScrubSummaryDetails = res;
        if (res === null) {
          this.autoScrubSummaryDetails = [];
        }
        this.autoReviewWidgetLoadingState = false;
        this.autoScrubSummaryDetails = this.autoScrubSummaryDetails.slice();

        for (let autoReviewDetail of this.autoScrubSummaryDetails) {
          if (autoReviewDetail.status === 'ANOMALY') {
            autoReviewDetail.displayStatus = 'Review Required';
          } else {
            if (autoReviewDetail.status === 'OKAY') {
              autoReviewDetail.displayStatus = 'GOOD';
            }
          }
        }

        this.autoScrubSummaryService.autoScrubSummaryDetails = this.autoScrubSummaryDetails;
        this.showSearchAutoReviw.emit(false);
      }, error => this.autoReviewWidgetLoadingState = false
      );

    this.subscriptions.push(subscription);
  }

  private onCustomerChange(customerID) {
    this.hideAutoReviwSearchPanel();
    this.resetAutoReviewParameters();
  }

  /*display  pagination*/
  public showPageRecords(pagedItems: AutoScrubSummary[]) {
    this.pagedItems = pagedItems;
    this.cdr.detectChanges();
  }

  public onStartDateChanged(event: IMyInputFieldChanged) {
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

  public onEndDateChanged(event: IMyInputFieldChanged) {
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

  private monthDifference(startDateValue, endDateValue) {
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

  public hideAutoReviwSearchPanel() {
    this.showAutoReviwSearch = false;
    this.showSearchAutoReviw.emit(false);
  }

  public resetAutoReviewParameters() {
    this.selectedThreshold = this.errThresholds[1].value;
    this.selectedLocation = [];
    this.startDate = { date: { year: (new Date()).getFullYear(), month: this.getPreviousMonth(), day: this.getDay() } };
    this.endDate = { date: { year: (new Date()).getFullYear(), month: (new Date()).getMonth() + 1, day: (new Date()).getDate() } };
  }
  public openHydrograph(locationId, locationName) {
    this._dialog.open(AlarmGraphComponent, {
      disableClose: true,
      data: {
        locationId: locationId,
        locationName: locationName,
        startDate: this.startDate,
        endDate: this.endDate,
        graphpage: 'autoReview'
      }
    }).afterClosed().subscribe(res => {
    });
  }
  public onSeriesHide(series) {
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
    this.hideAutoReviwSearchPanel();
    this.resetAutoReviewParameters();
  }
}

function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
