import { Http } from '@angular/http';
import { Component, OnInit, ViewChild, Input, Output, Pipe, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { QstartMonitorConfigurationComponent } from './qstart-monitor-configuration.component';
import { QstartModemPowerComponent } from './qstart-modem-power.component';
import { QstartDataService } from './services/qstart.service';


@Component ({
    selector: 'qstart-monitor',
    templateUrl: './qstart-monitor.html',
    providers: [QstartDataService]
})

export class QstartMonitorComponent {
    selectedLocation: Object;
    isConnecting: Object;
    menu: Boolean;
    locations: Array<any>;
    selectedLocationStatus: any;
    @ViewChild(QstartMonitorConfigurationComponent) private qstartMonitorConfigurationComponent: QstartMonitorConfigurationComponent;
    @ViewChild(QstartModemPowerComponent) private qstartModemPowerComponent: QstartModemPowerComponent;

    constructor(private qstartDataService: QstartDataService) {
        this.locations = [];
        this.selectedLocation = {};
    }


    ngOnInit() {
        this.isConnecting = false;

        this.locations = this.qstartDataService.getItems();

        this.locations.forEach(element => {
            if (element.series === 9000 && element.model === 0) {
                element.monitorType = "RainAlert III";
            } else if (element.series === 9000 && element.model === 1) {
                element.monitorType = "ECHO";
            }
        });

        if (this.locations.length > 0) {
            this.selectedLocation = this.locations[0];
        }
    }

    connect(location) {
        this.isConnecting = true;
        this.qstartDataService.getMonitorStatus(55)
           .subscribe(
               monitorStatus =>     {
                location.isConnected= !location.isConnected;
                this.selectedLocationStatus = monitorStatus;

                this.qstartDataService.disconnectMonitor(55)
                    .subscribe(
                        result =>  {
                            this.isConnecting = false;
                            location.isConnected = false;
                            console.log(result);
                        }, 
                        err => { 
                            this.isConnecting = false;
                            location.isConnected = false;
                            console.log("Error: " + err);
                        });
                },
                err => {
                    console.log("Error: " + err);
                    this.isConnecting = false;
                });
    }

    onComponentChange(value) {
        this.isConnecting = value;
    }

    displayMonitorConfig() {
        this.qstartMonitorConfigurationComponent.displayMonitorConfig();
    }

    displayModemPower() {
        this.qstartModemPowerComponent.displayModemPower();
    }

};