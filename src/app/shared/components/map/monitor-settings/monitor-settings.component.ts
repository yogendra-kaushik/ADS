import { Component, OnInit, OnChanges, Inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA, MdSnackBar, MdSnackBarRef, SimpleSnackBar } from '@angular/material';
import { CustomerService } from 'app/shared/services';
import { MonitorSettingService } from 'app/shared/services/monitor-setting.service';
import { LocationService } from 'app/shared/services/location.service';
import { Subscription } from 'rxjs/Subscription';
import { MonitorSetting, AddLocation } from 'app/shared';

@Component({
  selector: 'monitor-settings',
  templateUrl: './monitor-settings.component.html',
  styleUrls: ['./monitor-settings.component.scss']
})
export class MonitorSettingsComponent implements OnInit, OnDestroy {

  private subscriptions = new Array<Subscription>();
  private echoResponse: any;
  private response: any;
  private activeResponse: any;
  public ActivateLocationLoadingState: boolean;

  public monitorSetting = new MonitorSetting();
  public addLocation = new AddLocation();

  constructor(
    public dialogRef: MdDialogRef<MonitorSettingsComponent>,
    private customerService: CustomerService,
    private monitorSettingService: MonitorSettingService,
    @Inject(MD_DIALOG_DATA) public data: any,
    private locationService: LocationService,
    private _snackBar: MdSnackBar,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.monitorSetting.monitorSeries = this.data.MonitorSeries;
    this.monitorSetting.rainExceedingFlag = true;
    this.monitorSetting.logintensity = false;
    this.monitorSetting.logukintensity = false;
    this.monitorSetting.usedaylightsavingtime = false;
    this.monitorSetting.datadeliveryfastrate = 0;
    this.monitorSetting.datadeliverynormalrate = 0;
    this.monitorSetting.alarmenable = false;

    this.monitorSetting.lowlevelenable = false;
    this.monitorSetting.fullpipeenable = false;
    this.monitorSetting.highlevelenable = false;
    this.monitorSetting.highhighenable = false;
    this.monitorSetting.overflowenable = false;
    this.monitorSetting.tiltenable = false;
    this.monitorSetting.batterylowenable = false;
    this.monitorSetting.pipeHeight = 0;

    this.monitorSetting.datadeliverynormal = 0;
    this.monitorSetting.datadeliveryfast = 0;

    this.monitorSetting.SampleRateUI = [
      { value: 60, text: '1 minute' },
      { value: 120, text: '2 minutes' },
      { value: 300, text: '5 minutes' },
      { value: 900, text: '15 minutes' },
      { value: 1800, text: '30 minutes' },
      { value: 3600, text: '1 hour' },
      { value: 7200, text: '2 hours' },
      { value: 43200, text: '12 hours' },
      { value: 86400, text: '24 hours' }
    ];
    this.monitorSetting.NormalRate = [
      { value: 900, text: '15 minutes' },
      { value: 3600, text: '1 hour' },
      { value: 7200, text: '2 hours' },
      { value: 10800, text: '3 hours' },
      { value: 14400, text: '4 hours' },
      { value: 21600, text: '6 hours' },
      { value: 28800, text: '8 hours' },
      { value: 43200, text: '12 hours' },
      { value: 86400, text: '24 hours' }
    ];
    this.monitorSetting.FastRate = [
      { value: 300, text: '5 minutes' },
      { value: 900, text: '15 minutes' },
      { value: 3600, text: '1 hour' },
      { value: 7200, text: '2 hours' },
      { value: 10800, text: '3 hours' },
      { value: 14400, text: '4 hours' },
      { value: 21600, text: '6 hours' },
      { value: 28800, text: '8 hours' },
      { value: 43200, text: '12 hours' },
      { value: 86400, text: '24 hours' }
    ];
    this.monitorSetting.DataLogMode = [
      { value: 0, text: 'Synchronous' },
      { value: 1, text: 'Asynchronous' }
    ];
    this.customerService.getTimeZone().subscribe(res => {
      this.monitorSetting.TimeZone = res;
    });

    if (this.data.locationID === -1) {
      this.addLocation.locationName = this.data.LocationName;
      this.addLocation.description = this.data.Description || '';
      this.addLocation.manholeAddress = this.data.ManholeAddress || '';
      this.addLocation.latitude = this.data.Latitude || 0;
      this.addLocation.longitude = this.data.Longitude || 0;
      this.addLocation.isActive = this.data.IsActiveLocation;
      this.addLocation.series = this.data.MonitorSeries;
      this.addLocation.serialNumber = this.data.SerialNumber;
      this.addLocation.IPAddress = this.data.IpAddress;
      // Creating location based on provided input at add location form.
      let subscriptionAddLocation = this.locationService.addLocation(this.data.customerId, this.addLocation).subscribe(
        res => {
          this.monitorSetting.locationid = res;
          if (this.monitorSetting.locationid !== undefined && this.monitorSetting.locationid > 0) {
            let snackbarRef: MdSnackBarRef<SimpleSnackBar> = this._snackBar.open(this.data.LocationName + ' added successfully', '');
            setTimeout(snackbarRef.dismiss.bind(snackbarRef), 3000);
            this.cdr.detectChanges();
          } else {
            let snackbarRef: MdSnackBarRef<SimpleSnackBar> = this._snackBar.open('Unable to added location, please try again', '');
            setTimeout(snackbarRef.dismiss.bind(snackbarRef), 3000);
          }
        }
      );
      this.subscriptions.push(subscriptionAddLocation);
    } else if (this.data.locationID > 0) {
      this.monitorSetting.locationid = this.data.locationID;
    }
    this.monitorSetting.customerId = this.customerService.customerId;
    this.monitorSetting.serialnumber = this.data.SerialNumber;
    this.monitorSetting.ipaddress = this.data.IpAddress;

    this.monitorSetting.echoFastRate = [
      { value: 60, text: '1 minute' },
      { value: 120, text: '2 minutes' },
      { value: 300, text: '5 minutes' },
      { value: 900, text: '15 minutes' },
      { value: 1800, text: '30 minutes' },
      { value: 3600, text: '1 hour' },
      { value: 7200, text: '2 hours' },
      { value: 43200, text: '12 hours' },
      { value: 86400, text: '24 hours' }
    ];
    this.monitorSetting.echoNormalRate = [
      { value: 900, text: '15 minutes' },
      { value: 1800, text: '30 minutes' },
      { value: 3600, text: '1 hour' },
      { value: 7200, text: '2 hours' },
      { value: 10800, text: '3 hours' },
      { value: 14400, text: '4 hours' },
      { value: 21600, text: '6 hours' },
      { value: 28800, text: '8 hours' },
      { value: 43200, text: '12 hours' },
      { value: 86400, text: '24 hours' }
    ];
    this.monitorSetting.echoDataFastRate = [
      { value: 900, text: '15 minutes' },
      { value: 1800, text: '30 minutes' },
      { value: 3600, text: '1 hour' },
      { value: 7200, text: '2 hours' },
      { value: 10800, text: '3 hours' },
      { value: 14400, text: '4 hours' },
      { value: 21600, text: '6 hours' },
      { value: 28800, text: '8 hours' },
      { value: 43200, text: '12 hours' },
      { value: 86400, text: '24 hours' }
    ];
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  checkRainIntensityReqd() {
    if (this.monitorSetting.logintensity || this.monitorSetting.logukintensity) {
      this.monitorSetting.isRainIntensity = true;
    } else {
      this.monitorSetting.isRainIntensity = false;
    }
  }

  emitMonitorSettings() {
    this.dialogRef.close({ success: false });
  }

  public activateLocation() {
    this.ActivateLocationLoadingState = true;
    this.monitorSetting.alarmthreshold = 0;

    let subscriptionRainAlert = this.monitorSettingService.rainAlert(this.monitorSetting).subscribe(
      res => {
        this.response = res;
        this.ActivateLocationLoadingState = false;
        if (this.response !== undefined && this.response !== '') {
          let snackbarRef: MdSnackBarRef<SimpleSnackBar> = this._snackBar.open(this.response.responseMessage, '');
          setTimeout(snackbarRef.dismiss.bind(snackbarRef), 2000);
          this.activateMonitor(this.customerService.customerId, this.monitorSetting.locationid, this.data.SerialNumber,
            this.data.IpAddress);
        } else {
          let snackbarRef: MdSnackBarRef<SimpleSnackBar> = this._snackBar.open('Error in location configuration', '');
          setTimeout(snackbarRef.dismiss.bind(snackbarRef), 2000);
        }
      });
    this.subscriptions.push(subscriptionRainAlert);
  }

  public echoMonitorConfiguration() {
    this.ActivateLocationLoadingState = true;
    this.monitorSetting.lowlevelthreshold = 0;
    this.monitorSetting.highlevelthreshold = 0;
    this.monitorSetting.highhighthreshold = 0;
    this.monitorSetting.tiltthreshold = 0;
    this.monitorSetting.batterylowthreshold = 0;

    if (this.monitorSetting.datadeliveryipaddress === undefined) {
      this.monitorSetting.datadeliveryipaddress = '';
    }

    let subscriptionMonitorConf = this.monitorSettingService.echoMonitorConfiguration(this.monitorSetting).subscribe(
      res => {
        this.echoResponse = res;
        this.ActivateLocationLoadingState = false;
        if (this.echoResponse !== undefined && this.echoResponse !== '') {
          let snackbarRef: MdSnackBarRef<SimpleSnackBar> = this._snackBar.open(this.echoResponse.responseMessage, '');
          setTimeout(snackbarRef.dismiss.bind(snackbarRef), 2000);
          this.activateMonitor(this.customerService.customerId, this.monitorSetting.locationid, this.data.SerialNumber,
            this.data.IpAddress);
        } else {
          let snackbarRef: MdSnackBarRef<SimpleSnackBar> = this._snackBar.open('Error in ECHO configuration', '');
          setTimeout(snackbarRef.dismiss.bind(snackbarRef), 2000);
        }
      });
    this.subscriptions.push(subscriptionMonitorConf);
  }

  private activateMonitor(customerId: number, locationId: number, serialNumber: string, IPAddress: string) {
    this.ActivateLocationLoadingState = true;
    let subscriptionActivate = this.monitorSettingService.activateLocation(customerId, locationId, serialNumber, IPAddress).subscribe(
      result => {
        this.activeResponse = result;
        this.ActivateLocationLoadingState = false;
        if (this.activeResponse !== undefined && this.activeResponse !== '') {
          let snackbarRefAct: MdSnackBarRef<SimpleSnackBar> = this._snackBar.open(this.activeResponse.responseMessage, '');
          setTimeout(snackbarRefAct.dismiss.bind(snackbarRefAct), 3000);
          this.emitMonitorSettings();
        } else {
          let snackbarRefAct: MdSnackBarRef<SimpleSnackBar> = this._snackBar.open('Error in location activation', '');
          setTimeout(snackbarRefAct.dismiss.bind(snackbarRefAct), 3000);
        }
      }, error => this.handleMonitorError(error));
    this.subscriptions.push(subscriptionActivate);
  }

  private handleMonitorError(error: any) {
    this.ActivateLocationLoadingState = false;
    if (error._body.type === 'error') {
      let snackbarRef: MdSnackBarRef<SimpleSnackBar> = this._snackBar.open('Error at server end!', '');
      setTimeout(snackbarRef.dismiss.bind(snackbarRef), 3000);
    } else {
      let snackbarRef: MdSnackBarRef<SimpleSnackBar> = this._snackBar.open(error._body, '');
      setTimeout(snackbarRef.dismiss.bind(snackbarRef), 3000);
    }
  }
}
