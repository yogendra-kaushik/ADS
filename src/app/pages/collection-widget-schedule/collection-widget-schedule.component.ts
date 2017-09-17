import { Component, OnInit, ChangeDetectorRef, Inject, OnDestroy, ElementRef } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
import { UUID } from 'angular2-uuid';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { OrderByPipe } from '../../shared/pipes/order-by-pipe';
import { CustomerService, ScheduleCollectionService, LocationService } from 'app/shared/services';
import { Subscription } from 'rxjs/Subscription';
import { SelectItem, ScheduleCollection, Locations } from 'app/shared/models';

@Component({
  selector: 'collection-widget-schedule',
  templateUrl: './collection-widget-schedule.component.html',
  styleUrls: ['./collection-widget-schedule.component.scss']
})
export class CollectionWidgetScheduleComponent implements OnInit, OnDestroy {
  public pagedItems: Array<LocalLocation>;
  public locations: Array<Locations>;
  public uuid: UUID;
  public guid: UUID;
  private scheduleCollection: ScheduleCollection;
  public hideCreateButton: boolean;
  public showCreateSchedule: boolean;
  public listOfDays: Array<LocalListOfDay>;
  public scheduleName: string;
  public frequency: number;
  public alarmingFrequency: number;
  public actionSaveEdit: string;
  public listOfHours: Array<object>;
  public alarmFrequencyItems: Array<object>;
  private hourDisplayValue: number;
  public scheduleCollectionHeader: string;
  private isValidForCheckboxList: boolean;
  public disableUpdate: boolean;
  public showLocationMsg: boolean;
  public schedules: Array<ScheduleCollection>;
  public setFirstPage: boolean;
  public localScheduleCollection: Array<LocalScheduleCollection>;
  public showPagination: boolean;
  public schedulePagedItems: Array<LocalScheduleCollection>;
  private scheduleIdUpdate: number;
  public localListOfDays: Array<LocalListOfDay> = [];
  private collectionOfDays: Array<string> = [];
  private oldScheduleName: string;
  private oldFrequency: number;
  private oldAlarmingFrequency: number;
  public validateScheduleName: boolean;
  private oldLocalListOfDays: Array<LocalListOfDay> = [];
  public disableSave: boolean;
  private daysOfCollect: Array<boolean> = [];
  private daysToCollect: Array<boolean> = [];
  private olddaysToCollect: Array<boolean> = [];
  private filterLocations: Array<number> = [];
  private oldFilterLocations: Array<number> = [];
  private selectedLocation: Array<SelectItem> = [];
  private oldSelectedLocation: Array<SelectItem> = [];
  private filteredLocations: Array<SelectItem> = [];
  private subscriptions = new Array<Subscription>();

  constructor(private scheduleCollectionService: ScheduleCollectionService, private cdr: ChangeDetectorRef,
    private _dialog: MdDialog,
    private _snackBar: MdSnackBar,
    @Inject(MD_DIALOG_DATA) private data: any,
    public dialogRef: MdDialogRef<CollectionWidgetScheduleComponent>,
    private customerService: CustomerService,
    private locationService: LocationService) { }

  ngOnInit() {
    let filterPipe = new OrderByPipe();
    this.data.locations = filterPipe.transform(this.data.locations, 'locationName', false);
    this.locations = this.data.locations;
    this.locations.forEach((location: { locationId: number, locationName: string }) => {
      this.filteredLocations.push({
        id: location.locationId,
        text: location.locationName
      });
    });
    this.actionSaveEdit = 'Save';
    this.uuid = UUID.UUID();
    this.guid = UUID.UUID();
    this.schedules = this.data.schedules;
    this.localScheduleCollection = this.schedules;
    this.localScheduleCollection = this.createSchedules(this.schedules);
    this.localScheduleCollection = filterPipe.transform(this.localScheduleCollection, 'name', false);
    this.validatePagination(this.localScheduleCollection);
    this.listOfDays = [{ text: 'S', isSelected: false, apiText: 'Sun' }, { text: 'M', isSelected: false, apiText: 'M' },
    { text: 'T', isSelected: false, apiText: 'T' }, { text: 'W', isSelected: false, apiText: 'W' },
    { text: 'T', isSelected: false, apiText: 'Th' }, { text: 'F', isSelected: false, apiText: 'F' },
    { text: 'S', isSelected: false, apiText: 'Sa' }];
    this.listOfHours = [{ text: 'Hourly', value: 1 }, { text: '4 Hours', value: 4 },
    { text: '6 Hours', value: 6 }, { text: '8 Hours', value: 8 }, { text: '12 Hours', value: 12 },
    { text: '24 Hours', value: 24 }];
    this.alarmFrequencyItems = [{ text: '15 minutes', value: 15 }, { text: 'Hourly', value: 1 }, { text: '4 Hours', value: 4 },
    { text: '6 Hours', value: 6 }, { text: '8 Hours', value: 8 }, { text: '12 Hours', value: 12 }];
    this.createListOfDays(this.listOfDays, this.scheduleCollection);
    this.localListOfDays = this.localListOfDays;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private loadUpdateButton() {
    setTimeout(() => {
      this.showLocationMsg = false;
    }, 10);
  }

  public onChangeHour(value: number) {
    this.hourDisplayValue = value;
    this.validateUpdateBtn();
  }

  public onChangeAlarmFrequency(event) {
    this.validateUpdateBtn();
  }

  public showPageRecords(pagedItems: LocalLocation[]) {
    this.pagedItems = pagedItems;
    this.cdr.detectChanges();
  }

  public showSchedulePageRecords(pagedItems: LocalScheduleCollection[]) {
    this.schedulePagedItems = pagedItems;
    this.cdr.detectChanges();
  }

  private createListOfDays(listOfDays: LocalListOfDay[], scheduleCollection: ScheduleCollection) {
    let listOfDay;
    for (let counter = 0; counter < listOfDays.length; counter++) {
      listOfDay = new LocalListOfDay();
      listOfDay.text = listOfDays[counter].text;
      listOfDay.apiText = listOfDays[counter].apiText;

      if (this.actionSaveEdit === 'Update') {
        // below will check if it is for update case and  locationId is selected
        listOfDay.isSelected = (scheduleCollection === null || scheduleCollection === undefined ||
          this.collectionOfDays.find(dayCollect => dayCollect === listOfDay.apiText) === undefined ? false : true);
      } else {
        // below will check if it is for update case and  locationId is selected
        listOfDay.isSelected = (scheduleCollection === null || scheduleCollection === undefined ||
          scheduleCollection.collectionDays.find(dayCollect => dayCollect === listOfDay.apiText) === undefined ? false : true);
      }
      this.localListOfDays.push(listOfDay);
    }
  }

  public emitScheduleCollection() {
    this.dialogRef.close({ success: false });
  }

  public createScheduleCollection() {
    this.showCreateSchedule = true;
    this.actionSaveEdit = 'Save';
    this.scheduleName = '';
    this.oldScheduleName = '';
    this.frequency = null;
    this.oldFrequency = null;
    this.alarmingFrequency = null;
    this.oldAlarmingFrequency = null;
    this.showLocationMsg = true;
    this.selectedLocation = []; // clear the selection while creating the schedule collection
    this.scheduleCollectionHeader = 'Add Schedule Collection';
    this.listOfDays = [{ text: 'S', isSelected: false, apiText: 'Sun' }, { text: 'M', isSelected: false, apiText: 'M' },
    { text: 'T', isSelected: false, apiText: 'T' }, { text: 'W', isSelected: false, apiText: 'W' },
    { text: 'T', isSelected: false, apiText: 'Th' }, { text: 'F', isSelected: false, apiText: 'F' },
    { text: 'S', isSelected: false, apiText: 'Sa' }];
    this.localListOfDays = this.listOfDays;
    this.daysOfCollect = [];
    for (let collectionOfDay of this.localListOfDays) {
      this.daysOfCollect.push(collectionOfDay.isSelected);
    }
    if (this.contains(this.daysOfCollect, true)) {
      this.disableSave = false;
    } else {
      this.disableSave = true;
    }
    this.hourDisplayValue = null;
  }

  private contains(arr, element) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === element) {
        return true;
      }
    }
    return false;
  }

  public exitScheduleCollection(evt) {
    this.showCreateSchedule = false;
    this.hideCreateButton = false;
    this.showLocationMsg = false;
    this.isValidForCheckboxList = false;
    this.setFirstPage = true;
    evt.preventDefault();
  }

  public updateScheduleCollection(scheduleCollection: any) {
    this.showCreateSchedule = true;
    this.hideCreateButton = true;
    this.actionSaveEdit = 'Update';
    this.scheduleCollectionHeader = 'Edit Schedule Collection';
    this.disableUpdate = true;
    this.validateScheduleName = true;
    this.scheduleName = scheduleCollection.name;
    this.oldScheduleName = this.scheduleName;
    // tslint:disable-next-line:radix
    this.frequency = parseInt((scheduleCollection.frequency.split('Hrs')[0]));
    this.oldFrequency = this.frequency;
    this.daysToCollect = [];
    this.olddaysToCollect = [];
    this.filterLocations = [];
    this.oldFilterLocations = [];
    if (scheduleCollection.alarmingFrequency.toString().includes('15mins')) {
      this.alarmingFrequency = 15;
    } else {
      // tslint:disable-next-line:radix
      this.alarmingFrequency = parseInt((scheduleCollection.alarmingFrequency.split('Hrs')[0]));
    }
    this.oldAlarmingFrequency = this.alarmingFrequency;
    this.scheduleIdUpdate = scheduleCollection.scheduleId;
    this.collectionOfDays = scheduleCollection.collectionDays.split(',');
    this.localListOfDays = [];
    this.createListOfDays(this.listOfDays, scheduleCollection);
    this.oldLocalListOfDays = JSON.parse(JSON.stringify(this.localListOfDays));
    this.localListOfDays = this.localListOfDays;

    // Binding the location from  updating schedule collection to selected collection field
    this.selectedLocation = [];
    scheduleCollection.locations.forEach((location: { locationId: number, name: string }) => {
      this.selectedLocation.push({
        id: location.locationId,
        text: location.name
      });
    });
    this.oldSelectedLocation = JSON.parse(JSON.stringify(this.selectedLocation));
  }

  public validateUpdateBtn() {
    if (JSON.stringify(this.filterLocations) === JSON.stringify(this.oldFilterLocations) &&
      (this.oldScheduleName === this.scheduleName) && (this.oldFrequency === this.frequency)
      && (this.oldAlarmingFrequency === this.alarmingFrequency) &&
      JSON.stringify(this.daysToCollect) === JSON.stringify(this.olddaysToCollect)) {
      this.disableUpdate = true;
    } else {
      this.disableUpdate = false;
    }
  }

  public validateUpdateBtnForDaysToCollect() {
    this.daysToCollect = [];
    for (let collectionOfDay of this.localListOfDays) {
      this.daysToCollect.push(collectionOfDay.isSelected);
    }
    this.olddaysToCollect = [];
    for (let collectionOfDay of this.oldLocalListOfDays) {
      this.olddaysToCollect.push(collectionOfDay.isSelected);
    }

    if (JSON.stringify(this.filterLocations) === JSON.stringify(this.oldFilterLocations) &&
      (this.oldScheduleName === this.scheduleName) && (this.oldFrequency === this.frequency)
      && (this.oldAlarmingFrequency === this.alarmingFrequency) &&
      JSON.stringify(this.daysToCollect) === JSON.stringify(this.olddaysToCollect)) {
      this.disableUpdate = true;
    } else {
      this.disableUpdate = false;
    }
    this.daysOfCollect = [];
    for (let collectionOfDay of this.localListOfDays) {
      this.daysOfCollect.push(collectionOfDay.isSelected);
    }
    if (this.contains(this.daysOfCollect, true)) {
      this.disableSave = false;
    } else {
      this.disableSave = true;
    }
  }

  public saveScheduleCollection() {
    let scheduleCollection: ScheduleCollection = new ScheduleCollection();
    scheduleCollection.scheduleDescription = this.scheduleName;
    scheduleCollection.name = this.scheduleName;
    scheduleCollection.frequency = this.frequency;
    scheduleCollection.alarmingFrequency = this.alarmingFrequency;
    scheduleCollection.daysToCollect = this.localListOfDays.filter(element => element.isSelected)
      .map(element => element.apiText);

    scheduleCollection.locations = this.selectedLocation.map(element => element.id);

    if (this.actionSaveEdit === 'Update') {
      scheduleCollection.scheduleId = this.scheduleIdUpdate;
      this.editScheduleCollection(this.customerService.customerId, scheduleCollection);
    } else if (this.actionSaveEdit === 'Save') {
      // Convert frequency into minutes
      scheduleCollection.frequency = scheduleCollection.frequency * 60;
      if (scheduleCollection.alarmingFrequency === 15) {
        scheduleCollection.alarmingFrequency = scheduleCollection.alarmingFrequency;
      } else {
        scheduleCollection.alarmingFrequency = scheduleCollection.alarmingFrequency * 60;
      }

      //  Below will check if it is to add schedule collection
      let displayedMessage = `Scheduled Collection created`;
      let subscription1 = this.scheduleCollectionService.postScheduleCollection(this.customerService.customerId, scheduleCollection).
        subscribe(result => {
          let simpleSnackBarRef = this._snackBar.open(displayedMessage, 'Dismiss');
          setTimeout(simpleSnackBarRef.dismiss.bind(simpleSnackBarRef), 3000);
          this.loadScheduleCollection();
          this.guid = UUID.UUID();
          this.cdr.detectChanges();
        },
        error => this.handleError(error));
      this.subscriptions.push(subscription1);
    }
  }

  private handleError(error: any) {
    if (error.statusText.includes('Conflict')) {
      let simpleSnackBarRef = this._snackBar.open('Schedule already exists.', 'Dismiss');
      setTimeout(simpleSnackBarRef.dismiss.bind(simpleSnackBarRef), 3000);
    }
  }

  private editScheduleCollection(customerId: number, scheduleCollection: ScheduleCollection) {
    this._dialog.open(ConfirmationDialogComponent, {
      disableClose: true,
      data: {
        title: 'Update Confirmation',
        message: 'You are about to make changes to the scheduled collection. Would you like to proceed?',
        okText: 'Yes',
        cancelText: 'No'
      }
    }).afterClosed().subscribe(res => {
      if (res.whichButtorPressed === 'ok') {
        let subscription2 = this.scheduleCollectionService.updateScheduleCollection(this.scheduleIdUpdate,
          scheduleCollection.locations, this.scheduleName, this.frequency * 60,
          this.alarmingFrequency === 15 ? this.alarmingFrequency : this.alarmingFrequency * 60, scheduleCollection.daysToCollect).subscribe(
          result => {
            let simpleSnackBarRef = this._snackBar.open('Changes saved successfully.', 'Dismiss');
            setTimeout(simpleSnackBarRef.dismiss.bind(simpleSnackBarRef), 3000);
            this.showCreateSchedule = false;
            this.hideCreateButton = false;
            this.loadScheduleCollection();
            this.guid = UUID.UUID();
            this.cdr.detectChanges();
          }, error => this.handleError(error));
        this.subscriptions.push(subscription2);
      } else {
        this.showCreateSchedule = false;
        this.hideCreateButton = false;
        this.showLocationMsg = false;
        this.isValidForCheckboxList = false;
        this.setFirstPage = true;
        if (event !== undefined) {
          event.preventDefault();
        }
      }
    });
  }

  private loadScheduleCollection() {
    let subscription3 = this.scheduleCollectionService.getScheduleCollection(this.customerService.customerId).subscribe(
      result => {
        this.schedules = result.schedules;
        this.localScheduleCollection = this.createSchedules(this.schedules);
        let filterPipe = new OrderByPipe();
        this.localScheduleCollection = filterPipe.transform(this.localScheduleCollection, 'name', false);
        this.cdr.detectChanges();
        this.showCreateSchedule = false;
        this.validatePagination(this.localScheduleCollection);
        this.isValidForCheckboxList = false;
        this.setFirstPage = true;
      }
    );
    this.subscriptions.push(subscription3);
  }

  private validatePagination(localScheduleCollection: LocalScheduleCollection[]) {
    if (localScheduleCollection !== undefined && localScheduleCollection !== null && localScheduleCollection.length > 10) {
      this.showPagination = false;
    } else {
      this.showPagination = true;
    }
  }

  public deleteScheduleCollection(scheduleCollection: ScheduleCollection) {
    this._dialog.open(ConfirmationDialogComponent, {
      disableClose: true,
      data: {
        title: 'Delete Confirmation',
        message: 'Are you sure you want to delete the Scheduled Collection?',
        okText: 'Yes',
        cancelText: 'No'
      }
    }).afterClosed().subscribe(res => {
      if (res.whichButtorPressed === 'ok') {
        let subscription4 = this.scheduleCollectionService.deleteScheduleCollection(scheduleCollection.scheduleId).subscribe(
          result => {
            this.localScheduleCollection.splice(this.localScheduleCollection.indexOf(scheduleCollection), 1);
            this.schedules = <ScheduleCollection[]>this.localScheduleCollection;
            let simpleSnackBarRef = this._snackBar.open('Scheduled Collection deleted', 'Dismiss');
            setTimeout(simpleSnackBarRef.dismiss.bind(simpleSnackBarRef), 3000);
            this.loadScheduleCollection();
            this.guid = UUID.UUID();
            this.cdr.detectChanges();
          }
        );
        this.subscriptions.push(subscription4);
      }
    });
  }

  private createSchedules(scheduleCollection: ScheduleCollection[]) {
    let tempScheduleCollection: LocalScheduleCollection[] = [];
    if (this.schedules !== null && this.schedules !== undefined) {
      for (let counter = 0; counter < this.schedules.length; counter++) {
        tempScheduleCollection.push({
          scheduleId: scheduleCollection[counter].scheduleId,
          name: scheduleCollection[counter].name,
          scheduleDescription: scheduleCollection[counter].scheduleDescription,
          frequency: scheduleCollection[counter].frequency,
          alarmingFrequency: scheduleCollection[counter].alarmingFrequency,
          daysToCollect: scheduleCollection[counter].daysToCollect,
          locations: scheduleCollection[counter].locations,
          collectionDays: scheduleCollection[counter].collectionDays
        });
      }
    }
    return tempScheduleCollection;
  }

  // This event will be fired while selecting the location from searching text field
  public selected(value: SelectItem[]): void {
    this.selectLocation();
  }

  // This event will be fired while removing the location from searching text field
  public removed(location: SelectItem): void {
    this.selectedLocation = this.selectedLocation.filter(x => x.id !== location.id);
    this.selectLocation();
  }

  // Refresh selected location value while searching from searching text field
  public refreshValue(locations: SelectItem[]): void {
    for (let location of locations) {
      if (!this.locationService.containsLocation(location, this.selectedLocation)) {
        this.selectedLocation.push(location);
      }
    }
  }

  private selectLocation(): void {
    if (this.selectedLocation.length > 0) {
      this.isValidForCheckboxList = true;
      this.showLocationMsg = true;
      this.loadUpdateButton();
      if (this.actionSaveEdit === 'Update') {
        this.filterLocations = [];
        for (let filterLocationItem of this.selectedLocation) {
          this.filterLocations.push(filterLocationItem.id);
        }

        this.oldFilterLocations = [];
        for (let oldFilterLocationItem of this.oldSelectedLocation) {
          this.oldFilterLocations.push(oldFilterLocationItem.id);
        }

        if (JSON.stringify(this.filterLocations) === JSON.stringify(this.oldFilterLocations)
          && (this.oldScheduleName === this.scheduleName) && (this.oldFrequency === this.frequency)
          && (this.oldAlarmingFrequency === this.alarmingFrequency) &&
          JSON.stringify(this.daysToCollect) === JSON.stringify(this.olddaysToCollect)) {
          this.disableUpdate = true;
        } else {
          this.disableUpdate = false;
        }
      }
    } else {
      this.isValidForCheckboxList = false;
      this.showLocationMsg = true;
    }
  }
}

// supporting class for location.
class LocalLocation {
  locationId: number;
  locationName: string;
  isSelected: boolean;
}

class LocalScheduleCollection {
  scheduleId: number;
  scheduleDescription: string;
  name: string;
  frequency: number;
  alarmingFrequency: number;
  daysToCollect: string[];
  locations: number[];
  collectionDays: string[];
}

class LocalListOfDay {
  text: string;
  apiText: string;
  isSelected: boolean;
}


