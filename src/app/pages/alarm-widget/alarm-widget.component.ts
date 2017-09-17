import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, OnDestroy, OnChanges } from '@angular/core';
import { IMyOptions, IMyDate, IMyInputFieldChanged } from 'mydatepicker';
import { UUID } from 'angular2-uuid';
import * as Highcharts from 'Highcharts';
import { AlarmGraphComponent } from 'app/pages/alarm-graph/alarm-graph.component';
import { MdDialog } from '@angular/material';
import { CustomerService, LocationService, LocationGroupService, DateutilService, AlarmService } from 'app/shared/services';
import { Subscription } from 'rxjs/Subscription';
import { SelectItem, Locations, ActiveAlarm } from 'app/shared/models';

@Component({
  selector: 'alarm-widget',
  templateUrl: './alarm-widget.component.html',
  styleUrls: ['./alarm-widget.component.scss']
})
export class AlarmWidgetComponent implements OnInit, OnDestroy, OnChanges {
  @Input() public activeAlarms: Array<ActiveAlarm> = [];
  @Input() public locations: Array<Locations>;
  @Input() public showAlarmSearch: boolean;
  @Input() public showColumn: boolean;
  @Output() public showMap: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() public showSearchAlarm: EventEmitter<boolean> = new EventEmitter<boolean>();
  public displayStartDateErrMsg: boolean;
  public invalidStartDate: boolean;
  public invalidEndDate: boolean;
  public displayEndDateErrMsg: boolean;
  public invalidDateRange: boolean;
  public selectedUsers = new Array<any>();
  public users = new Array<any>();
  public showPagination = true;
  public pagedItems: Array<ActiveAlarm>;
  public uuid: UUID;
  public startDate: any = { date: { year: (new Date()).getFullYear(), month: this.getPreviousMonth(), day: this.getDay() } };
  public endDate: any = { date: { year: (new Date()).getFullYear(), month: (new Date()).getMonth() + 1, day: (new Date()).getDate() } };
  public myDatePickerOptions: IMyOptions = {
    dateFormat: 'mm/dd/yyyy',
    disableSince: <IMyDate>{ year: (new Date()).getFullYear(), month: (new Date()).getMonth() + 1, day: (new Date()).getDate() + 1 },
  };
  public listOfStatus: Array<object>;
  public status: number;
  public alarmWidgetLoadingState: boolean;

  private subscriptions = new Array<Subscription>();
  private endDateValidity: boolean;
  private startDateValidity: boolean;
  private endDateValue: string;
  private startDateValue: string;
  // display selected location using searching
  private selectedLocation: Array<SelectItem> = [];
  private filteredLocations: Array<SelectItem> = [];

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

  constructor(private alarmService: AlarmService,
    private dateutilService: DateutilService,
    private cdr: ChangeDetectorRef,
    private _dialog: MdDialog,
    private customerService: CustomerService,
    private locationService: LocationService,
    private locationGroupService: LocationGroupService
  ) {
    this.subscriptions.push(this.customerService.customerChange.subscribe(x => this.onCustomerChange()));
    this.subscriptions.push(this.locationGroupService.locationGroupChange.subscribe(() =>
      this.onLocationGroupChange()));
    this.users.push('All');
  }

  ngOnInit() {
    this.uuid = UUID.UUID();
    this.listOfStatus = [{ text: 'Unacknowledged', value: 0 }, { text: 'Uncleared', value: 1 },
    { text: 'Cleared', value: 2 }];
    if (this.activeAlarms) {
      this.activeAlarms.sort((a: any, b: any) => {
        if (a.state < b.state) {
          return -1;
        } else if (a.state > b.state) {
          return 1;
        } else {
          if (a.timestamp < b.timestamp) {
            return -1;
          } else if (a.timestamp > b.timestamp) {
            return 1;
          } else {
            return 0;
          }
        }
      });
    }
  }
  ngOnChanges() {
    this.filteredLocations = [];
    this.populateFilterLocations();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  public onCustomerChange() {
    this.hideAlarmSearchPanel();
    this.resetAlarmParameters();
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

  private monthDifference(startDateValue: string, endDateValue: string) {
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

  public onChangeStatus(value: number) {

  }
  /*display  pagination*/
  public showPageRecords(pagedItems: ActiveAlarm[]) {
    this.pagedItems = pagedItems;
    this.cdr.detectChanges();
  }

  public generateAlarmHistory() {
    this.alarmWidgetLoadingState = true;
    // Filter Location Ids from Selected Locations
    let locationIds: number[] = [];
    locationIds = this.selectedLocation.map(element => element.id);
    let subscription = this.alarmService.getAlarms(this.customerService.customerId,
      this.dateutilService.formatStartDate(this.dateutilService.startDate),
      this.dateutilService.formatEndDate(this.dateutilService.endDate), this.status, this.locationGroupService.locationGroupID).subscribe(
      result => {
        this.activeAlarms = result;
        this.alarmWidgetLoadingState = false;
        this.activeAlarms.sort((a: any, b: any) => {
          if (a.state < b.state) {
            return -1;
          } else if (a.state > b.state) {
            return 1;
          } else {
            if (a.timestamp < b.timestamp) {
              return -1;
            } else if (a.timestamp > b.timestamp) {
              return 1;
            } else {
              return 0;
            }
          }
        });
        this.alarmService.activeAlarms = this.activeAlarms;
        this.showMap.emit(false);
        this.showColumn = true;
        this.showSearchAlarm.emit(false);
        if (this.activeAlarms !== undefined && this.activeAlarms !== null && this.activeAlarms.length > 10) {
          this.showPagination = false;
        } else {
          this.showPagination = true;
        }
      }, error => this.alarmWidgetLoadingState = false
      );
    this.subscriptions.push(subscription);
  }
  public hideAlarmSearchPanel() {
    this.showAlarmSearch = false;
    this.showSearchAlarm.emit(false);
  }

  public changeAlarmStatus() {

  }

  public resetAlarmParameters() {
    this.status = null;
    this.selectedLocation = [];
    this.startDate = { date: { year: (new Date()).getFullYear(), month: this.getPreviousMonth(), day: this.getDay() } };
    this.endDate = { date: { year: (new Date()).getFullYear(), month: (new Date()).getMonth() + 1, day: (new Date()).getDate() } };
    this.selectedUsers = [];
  }

  public getMarkerLocationDetails(locationId: number) {
    this.locationService.locationId = locationId;
  }

  public openHydrograph(locationId: number, locationName: string, endDate: any) {
    this._dialog.open(AlarmGraphComponent, {
      disableClose: true,
      data: {
        locationId: locationId,
        locationName: locationName,
        endDate: new Date(endDate)
      }
    }).afterClosed().subscribe(res => {
    });
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
    this.hideAlarmSearchPanel();
    this.resetAlarmParameters();
  }

  public trackById(index, item) {
    return index;
  }
}

