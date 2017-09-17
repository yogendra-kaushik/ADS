import { Component, Input, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { MdDialogRef, MdDialog, MdDialogConfig, MdSnackBarRef, SimpleSnackBar, MdSnackBar } from '@angular/material';
import { Config, CustomerService, LocationService } from 'app/shared/services';
import { JsonpModule } from '@angular/http';
import { MonitorSettingsComponent } from 'app/shared/components/map/monitor-settings/monitor-settings.component';
import { AddLocation } from 'app/shared';

@Component({
  selector: 'add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.scss'],
})

export class AddLocationComponent implements OnInit {

  @Input() routedFromCustomerEditor: boolean;
  @Input() customerID: number;
  @Output() onCloseLocationEditor = new EventEmitter<boolean>();
  LocationName: string;
  Description: string;
  ManholeAddress: string;
  Latitude: number;
  Longitude: number;
  IsActiveLocation: boolean;
  MonitorSeries: string;
  SerialNumber: string;
  IpAddress: number;

  isActives: any;
  result: any;
  MonitorSeriesUI: Object[];
  public _addLocation = new AddLocation();

  constructor(
    public dialogRef: MdDialogRef<AddLocationComponent>,
    private locationService: LocationService,
    private _snackBar: MdSnackBar,
    private cdr: ChangeDetectorRef,
    private customerService: CustomerService,
    private _dialog: MdDialog
  ) {
  }

  ngOnInit() {
    this.isActives = [
      { value: true, text: 'Yes' },
      { value: false, text: 'No' }
    ];

    this.MonitorSeriesUI = [
      { value: 'TRITON+', text: 'TRITON+' },
      { value: 'ECHO', text: 'ECHO' },
      { value: 'RainAlert III', text: 'RainAlert III' },
    ];

    this.resetForm();
    this._addLocation.isActive = this.isActives[0].value;
  }

  emitAddLocation() {
    // if the editor is opened from customer editor hide it upon closing
    if (this.routedFromCustomerEditor) {
      this.onCloseLocationEditor.emit();
    // otherwise close the dialog
    } else {
      this.dialogRef.close({ success: false });
    }
  }

  activateLocation() {
    if (this._addLocation.latitude === undefined || this._addLocation.latitude === null) {
      this._addLocation.latitude = 0;
    }
    if (this._addLocation.longitude === undefined || this._addLocation.longitude === null) {
      this._addLocation.longitude = 0;
    }
    this._dialog.open(MonitorSettingsComponent, {
      disableClose: true,
      data: {
        customerId: this.customerService.customerId,
        LocationName: this._addLocation.locationName,
        Description: this._addLocation.description,
        ManholeAddress: this._addLocation.manholeAddress,
        Latitude: this._addLocation.latitude,
        Longitude: this._addLocation.longitude,
        IsActiveLocation: this._addLocation.isActive,
        MonitorSeries: this._addLocation.series,
        SerialNumber: this._addLocation.serialNumber,
        IpAddress: this._addLocation.IPAddress,
        locationID: -1
      }
    }).afterClosed().subscribe(res => {
      this.dialogRef.close({ success: false });
    });
  }
  addLocation() {
    // if the dialog is opened from customer editor use its customer id
    if (!this.routedFromCustomerEditor) {
      this.customerID = this.customerService.customerId;
    }

    this.locationService.addLocation(this.customerID, this._addLocation).subscribe(
      res => {
        this.result = res;
        if (this.result > -1) {
          let snackbarRef: MdSnackBarRef<SimpleSnackBar> = this._snackBar.open(this._addLocation.locationName + ' added successfully', '');
          setTimeout(snackbarRef.dismiss.bind(snackbarRef), 3000);
          this.cdr.detectChanges();
          this.resetForm();
          this.emitAddLocation();
        } else {
          let snackbarRef: MdSnackBarRef<SimpleSnackBar> = this._snackBar.open('Something went wrong when adding location', '');
          setTimeout(snackbarRef.dismiss.bind(snackbarRef), 3000);
        }
      }
    );
  }

  resetForm() {
    this._addLocation = { locationName: null, description: null, manholeAddress: null, latitude: null, longitude: null, 
      isActive: false, series: null, serialNumber: null, IPAddress: null };
  }
}
