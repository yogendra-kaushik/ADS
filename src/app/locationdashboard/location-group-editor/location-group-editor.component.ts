import { Component, OnInit, ChangeDetectorRef, Inject, OnDestroy } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef, MdDialog, MdSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Rx';
import { UUID } from 'angular2-uuid';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { Subscription } from 'rxjs/Subscription';
import { Config, CustomerService, LocationDashboardService, LocationGroupService } from 'app/shared/services';
import { Locations, LocationGroup, LocalLocation, LocalLocationGroup } from 'app/shared/models';
import { OrderByPipe } from 'app/shared/pipes';

@Component({
  selector: 'app-location-group-editor',
  templateUrl: './location-group-editor.component.html',
  styleUrls: ['./location-group-editor.component.scss']
})
export class LocationGroupEditorComponent implements OnInit, OnDestroy {

  public locationGroups: LocationGroup[];
  public locations: Locations[];
  public pagedItems: LocalLocation[];
  public groupPagedItems: LocalLocationGroup[];
  public uuid: UUID;
  public guid: UUID;
  public showPagination: boolean;
  public displayPagination: boolean;
  public isValidForCheckboxList: boolean;
  public hideGroupSection: boolean;
  public locationGroupName: string;
  public locationGroupDescription: string;
  public locationGroupIdUpdate: number;
  public localLocationsCollection: LocalLocation[] = [];
  public locationGroup: any;
  public purpose: string;  // it will capture whether it is for add or update group location
  public localLocationsFilteredCollection: LocalLocation[] = [];
  public oldLocalLocationsCollection: LocalLocation[] = [];
  public customerId: number;
  public localLocationGroups: LocalLocationGroup[] = [];
  public locationGroupHeader: string;
  public actionSaveEdit: string;
  public isSelected: boolean;
  public hideLocationMsg: boolean;
  public hideCreateButton: boolean;
  public disableUpdate: boolean;
  public setFirstPage: boolean;
  public validateGroupName = false;
  public oldLocationGroupName: string;
  public oldLocationGroupDescription: string;
  public filterLocations: boolean[] = [];
  public oldFilterLocations: boolean[] = [];
  private subscriptions = new Array<Subscription>();
  public locationGLoadingState: boolean;

  constructor(private locationGroupService: LocationGroupService,
    private locationDashboardService: LocationDashboardService,
    private customerService: CustomerService,
    private _dialog: MdDialog,
    private cdr: ChangeDetectorRef,
    private _snackBar: MdSnackBar,
    @Inject(MD_DIALOG_DATA) private data: any,
    public dialogRef: MdDialogRef<LocationGroupEditorComponent>
  ) { }

  public ngOnInit() {
    this.locationGroupHeader = 'Add Location Group';
    this.actionSaveEdit = 'Save';
    this.hideGroupSection = false;
    this.locationGroups = this.data.locationGroups;
    let filterPipe = new OrderByPipe();
    this.localLocationGroups = this.locationGroups;
    this.localLocationGroups = this.createLocationGroups(this.locationGroups);
    this.localLocationGroups = filterPipe.transform(this.localLocationGroups, 'name', false);
    this.locations = this.data.locations;
    this.locations = filterPipe.transform(this.locations, 'locationName', false);
    if (this.locations.length > 10) {
      this.displayPagination = false;
    } else {
      this.displayPagination = true;
    }
    this.validatePagination(this.localLocationGroups);
    this.uuid = UUID.UUID();
    this.guid = UUID.UUID();

    // Supporting code for create location-group.
    // below code will see whether it is for add or insert
    if (!(this.locationGroup === undefined || this.locationGroup === null)) {
      this.locationGroupName = this.locationGroup.name;
      this.locationGroupDescription = this.locationGroup.description;
      this.isValidForCheckboxList = true;
      this.purpose = 'Create';
    } else {
      this.isValidForCheckboxList = false;
      this.purpose = 'Create';
    }

    this.createLocationCollections(this.data.locations, this.locationGroup);
    this.localLocationsFilteredCollection = this.localLocationsCollection;
  }

  public ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  public emitCloseLocationGroupPopup() {
    this.dialogRef.close({ success: false });
  }

  public showPageRecords(pagedItems: any[]) {
    this.pagedItems = pagedItems;
    this.cdr.detectChanges();
  }

  public showGroupPageRecords(pagedItems: any[]) {
    this.groupPagedItems = pagedItems;
    this.cdr.detectChanges();
  }

  public selectLocation(location: LocalLocation) {
    this.localLocationsCollection[this.localLocationsCollection.indexOf(location)].isSelected = location.isSelected;
    this.localLocationsFilteredCollection[this.localLocationsFilteredCollection.indexOf(location)].isSelected = location.isSelected;

    if (this.localLocationsFilteredCollection.filter(location1 => location1.isSelected === true).length > 1) {
      this.isValidForCheckboxList = true;
      this.hideLocationMsg = true;
      if (this.actionSaveEdit === 'Update') {
        this.filterLocations = [];
        for (let filterLocationItem of this.localLocationsFilteredCollection) {
          this.filterLocations.push(filterLocationItem.isSelected);
        }

        this.oldFilterLocations = [];
        for (let oldFilterLocationItem of this.oldLocalLocationsCollection) {
          this.oldFilterLocations.push(oldFilterLocationItem.isSelected);
        }

        if (JSON.stringify(this.filterLocations) === JSON.stringify(this.oldFilterLocations) &&
          (this.oldLocationGroupName === this.locationGroupName) && (this.oldLocationGroupDescription === this.locationGroupDescription)) {
          this.disableUpdate = true;
        } else {
          this.disableUpdate = false;
        }
      }
    } else {
      this.isValidForCheckboxList = false;
      this.hideLocationMsg = false;
    }
  }
  public createLocationGroup() {
    this.locationGroupHeader = 'Add Location Group';
    this.hideGroupSection = true;
    this.locationGroupName = '';
    this.locationGroupDescription = '';
    this.actionSaveEdit = 'Save';
    this.isValidForCheckboxList = true;
  }

  public saveLocationGroup() {
    // setup location groups
    let locationGroup = <LocationGroup>{

      // customer id
      customerID: this.customerService.customerId,

      // location group name
      name: this.locationGroupName,

      // location description
      description: this.locationGroupDescription,

      // collection of selected groups
      locations: this.localLocationsCollection
        .filter(element => element.isSelected)
        .map(element => element.locationId)
    };

    if (this.actionSaveEdit === 'Update') {
      this.isValidForCheckboxList = false;
      locationGroup.locationGroupID = this.locationGroupIdUpdate;
      this.editLocationGroup(this.customerService.customerId, locationGroup);
    } else if (this.actionSaveEdit === 'Save') {
      locationGroup.locationGroupID = 0;
      //  Below will check if it is to add or update location group and show messsage accordingly
      let displayedMessage = (this.actionSaveEdit === 'Save' ? `${locationGroup.name} Location Group created successfully`
        : 'Location Group has been updated sucessfully.');
      this.locationGLoadingState = true;
      let subscription1 = this.locationGroupService.postLocationGroup(this.customerService.customerId, locationGroup).
        subscribe(result => {
          this.locationGLoadingState = false;
          let simpleSnackBarRef = this._snackBar.open(displayedMessage, 'Dismiss');
          setTimeout(simpleSnackBarRef.dismiss.bind(simpleSnackBarRef), 3000);
          this.loadLocationGroups();
          this.guid = UUID.UUID();
          this.cdr.detectChanges();
        }, (error: any) => {
          this.locationGLoadingState = false;
          this._snackBar.open(error.json().value);
        });

      this.subscriptions.push(subscription1);
    }
  }

  public editLocationGroup(customerId: number, locationGroup: LocationGroup) {
    this.hideLocationMsg = true;
    this.isValidForCheckboxList = true;
    this._dialog.open(ConfirmationDialogComponent, {
      disableClose: true,
      data: {
        title: 'Update Confirmation',
        message: 'You are about to make changes to the Location Group. Would you like to proceed?',
        okText: 'Yes',
        cancelText: 'No'
      }
    }).afterClosed().subscribe(res => {
      if (res.whichButtorPressed === 'ok') {
        this.locationGLoadingState = true;
        let subscription2 = this.locationGroupService.postLocationGroup(this.customerService.customerId, locationGroup).subscribe(
          result => {
            this.locationGLoadingState = false;
            let simpleSnackBarRef = this._snackBar.open('Changes saved successfully.', 'Dismiss');
            setTimeout(simpleSnackBarRef.dismiss.bind(simpleSnackBarRef), 3000);
            this.hideGroupSection = false;
            this.hideLocationMsg = false;
            this.hideCreateButton = false;
            this.loadLocationGroups();
            this.guid = UUID.UUID();
            this.cdr.detectChanges();
          }, error => this.locationGLoadingState = false
        );
        this.subscriptions.push(subscription2);
      } else {
        this.hideGroupSection = false;
        this.hideLocationMsg = false;
        this.isValidForCheckboxList = false;
        this.hideCreateButton = false;
        this.localLocationsCollection = [];
        this.createLocationCollections(this.data.locations, null);
        this.localLocationsFilteredCollection = this.localLocationsCollection;
        this.setFirstPage = true;
        if (event !== undefined) {
          event.preventDefault();
        }
      }
    });
  }

  public loadLocationGroups() {
    this.locationGLoadingState = true;
    let subscription3 = this.locationGroupService.getLocationGroups(this.customerService.customerId).subscribe(
      result => {
        this.locationGroups = result.locationGroups;
        this.locationGLoadingState = false;
        this.localLocationGroups = this.createLocationGroups(this.locationGroups);
        let filterPipe = new OrderByPipe();
        this.localLocationGroups = filterPipe.transform(this.localLocationGroups, 'name', false);
        this.cdr.detectChanges();
        this.hideGroupSection = false;
        this.validatePagination(this.localLocationGroups);
        this.isValidForCheckboxList = false;
        this.localLocationsCollection = [];
        this.createLocationCollections(this.data.locations, null);
        this.localLocationsFilteredCollection = this.localLocationsCollection;
        this.setFirstPage = true;
      }, error => this.locationGLoadingState = false
    );
    this.subscriptions.push(subscription3);
  }

  public validatePagination(localLocationGroups: LocalLocationGroup[]) {
    if (localLocationGroups !== undefined && localLocationGroups !== null && localLocationGroups.length > 10) {
      this.showPagination = false;
    } else {
      this.showPagination = true;
    }
  }

  public exitLocationGroup(evt) {
    this.hideGroupSection = false;
    this.hideLocationMsg = false;
    this.isValidForCheckboxList = false;
    this.hideCreateButton = false;
    this.localLocationsCollection = [];
    this.createLocationCollections(this.data.locations, null);
    this.localLocationsFilteredCollection = this.localLocationsCollection;
    this.setFirstPage = true;
    evt.preventDefault();
  }

  public updateLocationGroup(locationGroups: any) {
    this.hideGroupSection = true;
    this.hideLocationMsg = true;
    this.hideCreateButton = true;
    this.locationGroupName = locationGroups.name;
    this.oldLocationGroupName = this.locationGroupName;
    this.locationGroupDescription = locationGroups.description;
    this.oldLocationGroupDescription = this.locationGroupDescription;
    this.locationGroupIdUpdate = locationGroups.locationGroupID;
    this.locationGroupHeader = 'Edit Location Group';
    this.actionSaveEdit = 'Update';
    this.isValidForCheckboxList = true;
    this.disableUpdate = true;
    this.validateGroupName = true;
    let location;
    this.localLocationsCollection = [];
    this.createLocationCollections(this.data.locations, locationGroups);
    this.localLocationsFilteredCollection = this.localLocationsCollection;
    this.oldLocalLocationsCollection = JSON.parse(JSON.stringify(this.localLocationsFilteredCollection));
  }

  public validateUpdateBtnForGroupName() {
    if (window.navigator.userAgent.indexOf('Trident/') > 0) {
      if (JSON.stringify(this.filterLocations) === JSON.stringify(this.oldFilterLocations) &&
        (this.oldLocationGroupName === this.locationGroupName) && this.oldLocationGroupDescription === this.locationGroupDescription) {
        this.disableUpdate = true;
      } else {
        this.disableUpdate = false;
      }
    } else {
      if (JSON.stringify(this.filterLocations) === JSON.stringify(this.oldFilterLocations) &&
        (this.oldLocationGroupName === this.locationGroupName) && this.oldLocationGroupDescription === this.locationGroupDescription) {
        this.disableUpdate = true;
      } else {
        this.disableUpdate = false;
      }
    }
  }

  public validateUpdateBtnForGroupDesc() {
    if (window.navigator.userAgent.indexOf('Trident/') > 0) {
      if (JSON.stringify(this.filterLocations) === JSON.stringify(this.oldFilterLocations) &&
        (this.oldLocationGroupDescription === this.locationGroupDescription) && this.oldLocationGroupName === this.locationGroupName) {
        this.disableUpdate = true;
      } else {
        this.disableUpdate = false;
      }
    } else {
      if (JSON.stringify(this.filterLocations) === JSON.stringify(this.oldFilterLocations) &&
        (this.oldLocationGroupDescription === this.locationGroupDescription) && this.oldLocationGroupName === this.locationGroupName) {
        this.disableUpdate = true;
      } else {
        this.disableUpdate = false;
      }
    }
  }

  public deleteLocationGroup(locationGroups: LocalLocationGroup) {
    this._dialog.open(ConfirmationDialogComponent, {
      disableClose: true,
      data: {
        title: 'Delete Confirmation',
        message: 'Are you sure you want to delete the Location Group?',
        okText: 'Yes',
        cancelText: 'No'
      }
    }).afterClosed().subscribe(res => {
      if (res.whichButtorPressed === 'ok') {
        this.locationGLoadingState = true;
        let subscription4 = this.locationGroupService.deleteLocationGroups(locationGroups.locationGroupID).subscribe(
          result => {
            this.locationGLoadingState = false;
            this.localLocationGroups.splice(this.localLocationGroups.indexOf(locationGroups), 1);
            this.locationGroups = <LocationGroup[]>this.localLocationGroups;

            let simpleSnackBarRef = this._snackBar.open('Location Group deleted.', 'Dismiss');
            setTimeout(simpleSnackBarRef.dismiss.bind(simpleSnackBarRef), 3000);
            this.loadLocationGroups();
            this.guid = UUID.UUID();
            this.cdr.detectChanges();
          }, error => this.locationGLoadingState = false
        );
        this.subscriptions.push(subscription4);
      }
    });
  }

  public createLocationCollections(locations: Locations[], locationGroup: any) {
    let location;
    for (let counter = 0; counter < locations.length; counter++) {
      if (locations[counter].isActiveLocation === true) {
        location = new LocalLocation();
        location.locationId = locations[counter].locationId;
        location.locationName = locations[counter].locationName;

        // below will check if it is for update case and  locationId is selected
        location.isSelected = (locationGroup === null || locationGroup === undefined ||
          locationGroup.locations.find(loc => loc.locationID === location.locationId) === undefined ? false : true);
        this.localLocationsCollection.push(location);
      }
    }
  }

  public createLocationGroups(locationGroups: LocationGroup[]) {
    let tempLocationGroups: LocalLocationGroup[] = [];
    if (this.locationGroups !== null && this.locationGroups !== undefined) {
      for (let counter = 0; counter < this.locationGroups.length; counter++) {
        tempLocationGroups.push({
          customerID: this.customerService.customerId,
          locationGroupID: locationGroups[counter].locationGroupID,
          name: locationGroups[counter].name,
          description: locationGroups[counter].description,
          locations: locationGroups[counter].locations
        });
      }
    }
    return tempLocationGroups;
  }
}
