import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Locations } from '../../../models/locations';
import { KeyValue } from '../../../models/key-value';
import { CollectService } from '../../../services/collect.service';
import { MdDialogRef, MdDialog, MdDialogConfig, MdSnackBar, MdSnackBarRef, SimpleSnackBar } from '@angular/material';
import { ConfirmDialog } from '../../confirm-dialog.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'map-cluster-locations',
  templateUrl: './cluster-locations.component.html',
  providers: [CollectService, MdSnackBar],
  styleUrls: ['./cluster-locations.component.scss']
})
export class ClusterLocationsComponent implements OnInit {
  @Output() closeMapLocationsPopup: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() clusterLocations: any;
  @Input() customerId;
  @Output() openLocationDetailsPopUp: EventEmitter<Locations> = new EventEmitter<Locations>();
  isCollecting: Boolean;
  message: string = 'Collect has been initiated.';
  actionLabel: string = 'Dismiss';
  flowMonitorSeries: string[] = ["TRITON+", "Triton", "Triton IM", "FlowHawk", "FlowShark", "FlowShark IS", "FlowShark RT", "Gateway", "iCE3", "1502", "1502EM", "1506", "2000", "3000", "3500", "3500S", "3600", "4000", "4500", "4500S", "5500", "5600", "7510", "7510"];
  levelMonitorSeries: string[] = ["ECHO", "FlowAlert"];
  rainFallMonitorSeries: string[] = ["RainAlert III", "RainAlert II"];
  constructor(private collectService: CollectService, public dialog: MdDialog, private _snackBar: MdSnackBar) { }

  ngOnInit() {
  }
  checkImage(location) {
    if (this.rainFallMonitorSeries.indexOf(location.series) >= 0) {
      if (location.isActiveLocation) {
        return '../../assets/images/triangle.png'
      } else {
        return '../../assets/images/triangle_white.png'
      }

    } else if (this.levelMonitorSeries.indexOf(location.series) >= 0) {
      if (location.isActiveLocation) {
        return '../../assets/images/square.png'
      } else {
        return '../../assets/images/square_white.png'
      }

    } else if (this.flowMonitorSeries.indexOf(location.series) >= 0) {
      if (location.isActiveLocation) {
        return '../../assets/images/circle.png'
      } else {
        return '../../assets/images/circle_white.png'
      }
    }else{
      return '../../assets/images/GreenNoCoords.png'
    }
  }
  emitCloseMapLocationsPopup() {
    this.closeMapLocationsPopup.emit(true);
  }

  emitOpenLocationDetailsPopUp(location: Locations) {
    this.openLocationDetailsPopUp.emit(location);
  }

  openModbusDialog() {
    let config = new MdDialogConfig();
    let dialogRef: MdDialogRef<ConfirmDialog> = this.dialog.open(ConfirmDialog, config);
    dialogRef.componentInstance.title = "Collect";
    dialogRef.componentInstance.message = "Collect has been initiated.";
    setTimeout(() => {
      dialogRef.close();
    }, 3000);
  }

  //Added to open snacBar style of message.
  openSnackBarDialog() {
    let snackbarRef: MdSnackBarRef<SimpleSnackBar> = this._snackBar.open(this.message, this.actionLabel);
    setTimeout(() => {
      snackbarRef.afterDismissed().subscribe(() => {
        console.log('Notification Dismissed!');
      });
    }, 3000);
  }

  collectLocations(clusterLocations) {
    if (clusterLocations.length > 0) {
      for (let location of clusterLocations) {
        this.isCollecting = true;

        this.collectService.collectLocation(this.customerId, location.locationId)
          .subscribe(
          (data) => {
            this.isCollecting = false;
          },
          (err) => {
            this.isCollecting = false;
            console.log(err);
          })
      }
      //this.openModbusDialog();
      this.openSnackBarDialog();
    }
  }
}
