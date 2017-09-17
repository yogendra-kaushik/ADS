import { Http } from '@angular/http';
import { Component, OnInit, Input, Output, Pipe, EventEmitter } from '@angular/core';
import { QstartMonitorComponent } from './qstart-monitor.component';
import { NgForm } from '@angular/forms';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { QstartModbusComponent } from './qstart-modbus.component';
import { QstartDataService } from './services/qstart.service';

@Component ({
    selector: 'qstart-monitor-configuration',
    templateUrl: './qstart-monitor-configuration.html',
    providers: [QstartDataService]
})

export class QstartMonitorConfigurationComponent implements OnInit {
    @Input() selectedLocation: Object;
    @Input() newMonitor: Boolean;
    @Input() isConnecting: Boolean;
    @Output() outputEvent:EventEmitter<Boolean>=new EventEmitter();
    displayConfiguration: Boolean;
    monitor: Object;
    series: Array<any>;
    connect: Array<any>;
    interval: Array<any>;
    tempMonitorData: Object;   
    
    constructor(public dialog: MdDialog, private qstartDataService: QstartDataService) {
        this.series = [ 'ECHO', 'RainAlert III'];
        this.interval = [ 0, 5, 10, 15];       
    }

    ngOnInit() {  
        if (!this.monitor && this.newMonitor) {
             this.monitor =  {
                name: '',
                creationTime: '',
                timeZoneOffset: 1,
                serialNumber: 0,
                active: false,
                communication: {
                    connectionType: 0,
                    protocolType: 2,
                    address: "",
                    baudRate: 0,
                    modbusID: 0,
                    modbusResponseDelay: 0,
                    mismatches: []
                },
                series: 9000,
                model: 0,
                sampleRateNormal: 5,
                sampleRateFast: 0,
                scanRateNormal: 0,
                secondarySampleRate: 0,
                collect: {
                    autoCollect: true,
                    autoCollectStartTime: "",
                    manualCollectStartTime: "",
                    manualCollectEndTime: ""
                },
                installations: [
                    {
                    type: 0,
                    number: 0,
                    description: "",
                    devices: [
                        {
                        type: 1,
                        installationNumber: 0,
                        active: true,
                        name: ""
                        }
                    ],
                    closestRainGauge: "",
                    drainageBasinNumber: 0,
                    generalDescriptions: [
                        ""
                    ],
                    elevation: 0,
                    latitude: 0,
                    longitude: 0,
                    mismatches: [
                        ""
                    ]
                    }
                ],
                formatting: {
                    units: [
                    {
                        type: 0,
                        factor: 0,
                        title: ""
                    }
                    ],
                    dateTimeFormat: "",
                    csvDelimiter: "",
                    csvDecimal: "",
                    mismatches: [
                    ""
                    ]
                }
            };

            this.displayConfiguration = true;

           }
        //Object.assign(this.tempMonitorData, this.monitor);
    }

    displayMonitorConfig() {
        this.displayConfiguration = !this.displayConfiguration;

        if (this.displayConfiguration) {
             this.getMonitorConfiguration(this.selectedLocation['id']);
        }
    }

    getMonitorConfiguration(monitorID) {

            this.isConnecting = true;
            this.outputEvent.emit(this.isConnecting);

            this.qstartDataService.getMonitorConfiguration(55)
                .subscribe(
                    result=> {
                        this.monitor = result;

                        this.qstartDataService.disconnectMonitor(55)
                            .subscribe(
                                disconnect => {
                                    this.isConnecting = false;
                                    this.outputEvent.emit(this.isConnecting);
                                },
                                err=> {
                                    console.log("Error: ", err);
                                    this.isConnecting = false;
                                    this.outputEvent.emit(this.isConnecting);
                                }
                            );
                    },
                    err => {
                        console.log("Error: " + err);
             this.monitor =  {
                name: '',
                creationTime: '',
                timeZoneOffset: 1,
                serialNumber: 0,
                active: false,
                communication: {
                    connectionType: 0,
                    protocolType: 2,
                    address: "",
                    baudRate: 0,
                    modbusID: 0,
                    modbusResponseDelay: 0,
                    mismatches: []
                },
                series: 9000,
                model: 0,
                sampleRateNormal: 5,
                sampleRateFast: 0,
                scanRateNormal: 0,
                secondarySampleRate: 0,
                collect: {
                    autoCollect: true,
                    autoCollectStartTime: "",
                    manualCollectStartTime: "",
                    manualCollectEndTime: ""
                },
                installations: [
                    {
                    type: 0,
                    number: 0,
                    description: "",
                    devices: [
                        {
                        type: 1,
                        installationNumber: 0,
                        active: true,
                        name: ""
                        }
                    ],
                    closestRainGauge: "",
                    drainageBasinNumber: 0,
                    generalDescriptions: [
                        ""
                    ],
                    elevation: 0,
                    latitude: 0,
                    longitude: 0,
                    mismatches: [
                        ""
                    ]
                    }
                ],
                formatting: {
                    units: [
                    {
                        type: 0,
                        factor: 0,
                        title: ""
                    }
                    ],
                    dateTimeFormat: "",
                    csvDelimiter: "",
                    csvDecimal: "",
                    mismatches: [
                    ""
                    ]
                }
            };

                        this.isConnecting = false;
                        this.outputEvent.emit(this.isConnecting);
                    });
    }
    formSubmitted() {

    }

    resetForm() {
         //Object.assign(this.monitor, this.tempMonitorData);
    }

    changeModbus() {
        if (this.monitor['communication'].modbusID == 0) {
            this.monitor['communication'].modbusID = 1;
            this.monitor['communication'].modbusResponseDelay = 10;
            this.openModbusDialog();
        } else {
            this.monitor['communication'].modbusID = 0;
            this.dialog.closeAll();
        }
    }

    openModbusDialog() {
            let config = new MdDialogConfig();
            let dialogRef: MdDialogRef<QstartModbusComponent> = this.dialog.open(QstartModbusComponent, config);
            dialogRef.componentInstance.monitor = this.monitor;
            dialogRef.afterClosed().subscribe(result => {
                console.log("modbus id: " + this.monitor['communication'].modbusID);
            });
    }
}

