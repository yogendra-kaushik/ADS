import { Component, OnInit, Input, EventEmitter, Output, ChangeDetectorRef, OnDestroy, OnChanges } from '@angular/core';
import { RoundPipe } from 'app/shared/pipes/round.pipe';
import { CustomerService, LocationService, BlockagePredictionService, LocationGroupService } from '../../shared/services';
import { UUID } from 'angular2-uuid';
import { IMyOptions, IMyDate, IMyInputFieldChanged } from 'mydatepicker';
import { Subscription } from 'rxjs/Subscription';
import { SelectItem, Locations, BlockagePrediction } from 'app/shared/models';

@Component({
  selector: 'blockage-prediction-widget',
  templateUrl: './blockage-prediction-widget.component.html',
  styleUrls: ['./blockage-prediction-widget.component.scss']
})
export class BlockagePredictionWidgetComponent implements OnInit, OnDestroy, OnChanges {
  @Input() blockagePredictionDetails: Array<BlockagePrediction>;
  @Input() public locations: Array<Locations>;
  @Input() public showBlockagePredictionSearch: boolean;
  @Output() public showMap: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() public showSearchBlockagePrediction: EventEmitter<boolean> = new EventEmitter<boolean>();
  public displayStartDateErrMsg: boolean;
  public invalidStartDate: boolean;
  public invalidEndDate: boolean;
  public displayEndDateErrMsg: boolean;
  public invalidDateRange: boolean;
  public showPagination = true;
  public pagedItems: Array<BlockagePrediction>;
  public uuid: UUID;
  public startDate: any = { date: { year: (new Date()).getFullYear(), month: this.getPreviousMonth(), day: this.getDay() } };
  public endDate: any = { date: { year: (new Date()).getFullYear(), month: (new Date()).getMonth() + 1, day: (new Date()).getDate() } };
  public myDatePickerOptions: IMyOptions = {
    dateFormat: 'mm/dd/yyyy',
    disableSince: <IMyDate>{ year: (new Date()).getFullYear(), month: (new Date()).getMonth() + 1, day: (new Date()).getDate() + 1 },
  };
  public statuses: Array<string>;
  public selectedStatus: string;

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

  constructor(private blockagePredictionService: BlockagePredictionService,
    private customerService: CustomerService,
    private locationService: LocationService,
    private locationGroupService: LocationGroupService) {
    this.subscriptions.push(this.customerService.customerChange.subscribe(x => this.onCustomerChange()));
    this.subscriptions.push(this.locationGroupService.locationGroupChange.subscribe(() =>
      this.onLocationGroupChange()));
  }

  ngOnInit() {
    this.uuid = UUID.UUID();
    this.statuses = ['CRITICAL', 'GOOD', 'LOW', 'UNKNOWN'];
  }

  ngOnChanges() {
    this.filteredLocations = [];
    this.populateFilterLocations();
  }

  private onCustomerChange() {
    this.hideBlockagePredictionSearchPanel();
    this.resetBlockagePredictionParameters();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
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

  // Refresh selected location value while searching from searching text field
  public refreshValue(location: SelectItem): void {
    this.selectedLocation = [];
    this.selectedLocation.push({
      id: location.id,
      text: location.text
    });
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

  public resetBlockagePredictionParameters() {
    this.selectedLocation = [];
    this.selectedStatus = '';
    this.startDate = { date: { year: (new Date()).getFullYear(), month: this.getPreviousMonth(), day: this.getDay() } };
    this.endDate = { date: { year: (new Date()).getFullYear(), month: (new Date()).getMonth() + 1, day: (new Date()).getDate() } };
  }

  public getMarkerLocationDetails(locationId: number) {
    this.locationService.locationId = locationId;
  }

  public hideBlockagePredictionSearchPanel() {
    this.showBlockagePredictionSearch = false;
    this.showSearchBlockagePrediction.emit(false);
  }

  private onLocationGroupChange() {
    this.hideBlockagePredictionSearchPanel();
    this.resetBlockagePredictionParameters();
  }

  // Todo: As Api is not ready
  public generateBlockagePredictionDetails() {

  }

}
