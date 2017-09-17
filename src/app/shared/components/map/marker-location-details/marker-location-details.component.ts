import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { LocationDetails } from '../../../models/location-details';
import { GeneralComponent } from './general/general.component';
import { CollectService } from '../../../services/collect.service';
import { MdDialogRef, MdDialog, MdDialogConfig, MdSnackBarRef, SimpleSnackBar, MdSnackBar } from '@angular/material';
import { ConfirmDialog } from '../../confirm-dialog.component';
import { CollectionWidgetScheduleComponent } from 'app/pages/collection-widget-schedule/collection-widget-schedule.component';
import { LocationDashboardService } from '../../../services/location-dashboard.service';
import { Config } from '../../../services/config';
import { Locations } from 'app/shared/models/locations';
import { ScheduleCollectionService } from '../../../services/schedule-collection.service';
import { ScheduleCollection } from '../../../models/schedule-collection';
import { CustomerService } from 'app/shared/services';
import { MonitorSettingsComponent } from 'app/shared/components/map/monitor-settings/monitor-settings.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'marker-location-details',
  templateUrl: './marker-location-details.component.html',
  providers: [CollectService, ScheduleCollectionService],
  styleUrls: ['./marker-location-details.component.scss']
})

export class MarkerLocationDetailsComponent implements OnInit {
  @Output() closeMapLocationDetailPopup: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() locationDetails: LocationDetails;
  @Input() customerId;
  isCollecting: Boolean;
  message = 'Collect has been initiated.';
  actionLabel = 'Dismiss';
  locations: Locations;
  schedules: ScheduleCollection[];

  Description: string;
  ManholeAddress: string;
  Latitude: number;
  Longitude: number;
  IsActiveLocation: boolean;
  MonitorSeries: string;
  SerialNumber: string;
  IpAddress: string;
  isActives: Object;
  editMode: boolean;
  locationID: number;
  locationName: string;
  visibleGeneralWidget = true;
  visibleCollectionWidget: boolean;
  visibleInstallationWidget: boolean;
  visibleDataWidget: boolean;
  showLocationEditor: boolean;
  public activateState = false;

  constructor(private collectService: CollectService, public dialog: MdDialog, private _snackBar: MdSnackBar,
    private locationDashboardService: LocationDashboardService, private scheduleCollectionService: ScheduleCollectionService,
    private customerService: CustomerService,
    private _dialog: MdDialog) { }

  ngOnInit() {
    // get the location for selected customers.
    this.locationDashboardService.getLocations(this.customerService.customerId).subscribe(
      res => this.locations = res
    );

    this.scheduleCollectionService.getScheduleCollection(this.customerService.customerId).subscribe(
      result => {
        this.schedules = result.schedules;
      }
    );

    this.isActives = [
      { value: true, text: 'Yes' },
      { value: false, text: 'No' }
    ];
    this.Description = this.locationDetails.description;
    this.ManholeAddress = this.locationDetails.manholeAddress;
    this.Latitude = this.locationDetails.coordinate.latitude;
    this.Longitude = this.locationDetails.coordinate.longitude;
    this.IsActiveLocation = this.locationDetails.isActive;
    this.MonitorSeries = this.locationDetails.series;
    this.SerialNumber = this.locationDetails.serialNumber;
    this.IpAddress = this.locationDetails.ipaddress;
    this.locationID = this.locationDetails.locationID;
    this.locationName = this.locationDetails.locationName;

    if (this.MonitorSeries !== 'RainAlert III' && this.MonitorSeries !== 'ECHO') {
      this.activateState = true;
    }
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges() {
  }

  showGeneralWidget() {
    if (this.visibleGeneralWidget) {
      this.visibleGeneralWidget = false;
    } else {
      this.showOneWidget(true, false, false, false);
    }
  }
  showCollectionWidget() {
    if (this.visibleCollectionWidget) {
      this.visibleCollectionWidget = false;
    } else {
      this.showOneWidget(false, true, false, false);
    }
  }
  showInstallationWidget() {
    if (this.visibleInstallationWidget) {
      this.visibleInstallationWidget = false;
    } else {
      this.showOneWidget(false, false, true, false);
    }
  }
  showDataWidget() {
    if (this.visibleDataWidget) {
      this.visibleDataWidget = false;
    } else {
      this.showOneWidget(false, false, false, true);
    }
  }
  showOneWidget(GeneralWidget, CollectionWidget, InstallationWidget, DataWidget) {
    this.visibleGeneralWidget = GeneralWidget;
    this.visibleCollectionWidget = CollectionWidget;
    this.visibleInstallationWidget = InstallationWidget;
    this.visibleDataWidget = DataWidget;
  }
  locationEditor() {
    this.showLocationEditor = !this.showLocationEditor;
  }
  editLocation() {
    this.editMode = true;
  }
  emitCloseMapLocationDetailPopup() {
    this.closeMapLocationDetailPopup.emit(true);
  }

  activateLocation() {
    if (this.Latitude === undefined || this.Latitude === null) {
      this.Latitude = 0;
    }
    if (this.Longitude === undefined || this.Longitude === null) {
      this.Longitude = 0;
    }
    if (this.IpAddress === undefined || this.IpAddress === null) {
      this.IpAddress = '';
    }
    this._dialog.open(MonitorSettingsComponent, {
      disableClose: true,
      data: {
        customerId: this.customerService.customerId,
        LocationName: this.locationName,
        Description: this.Description,
        ManholeAddress: this.ManholeAddress,
        Latitude: this.Latitude,
        Longitude: this.Longitude,
        IsActiveLocation: this.IsActiveLocation,
        MonitorSeries: this.MonitorSeries,
        SerialNumber: this.SerialNumber,
        IpAddress: this.IpAddress,
        locationID: this.locationID
      }
    });
  }

  openModbusDialog() {
    let config = new MdDialogConfig();
    let dialogRef: MdDialogRef<ConfirmDialog> = this.dialog.open(ConfirmDialog, config);
    dialogRef.componentInstance.title = 'Collect';
    dialogRef.componentInstance.message = 'Collect has been initiated.';
    setTimeout(() => {
      dialogRef.close();
    }, 3000);
  }

  openSnackBarDialog() {
    let snackbarRef: MdSnackBarRef<SimpleSnackBar> = this._snackBar.open(this.message, this.actionLabel);
    setTimeout(() => {
      snackbarRef.afterDismissed().subscribe(() => {
        console.log('Notification Dismissed!');
      });
    }, 3000);
  }

  collectLocation(locationID: number) {
    this.isCollecting = true;
    this.collectService.collectLocation(this.customerId, locationID)
      .subscribe(
      (data) => {
        this.isCollecting = false;
        //this.openModbusDialog();
        this.openSnackBarDialog();
      },
      (err) => {
        this.isCollecting = false;
        console.log(err);
      })
  }

  scheduleCollection() {
    this.dialog.open(CollectionWidgetScheduleComponent, {
      disableClose: true,
      data: {
        locations: this.locations,
        schedules: this.schedules
      }
    }).afterClosed().subscribe(res => {
      this.loadScheduleCollection();
    });
  }

  loadScheduleCollection() {
    this.scheduleCollectionService.getScheduleCollection(this.customerService.customerId).subscribe(
      result => {
        this.schedules = result.schedules;
      },
      error => this.handleError(error)
    );
  }
  handleError(error: any) {
    this.schedules = [];
  }
}
