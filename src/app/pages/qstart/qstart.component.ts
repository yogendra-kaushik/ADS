import { Http } from '@angular/http';
import { Component, OnInit, Input, Pipe, OnDestroy } from '@angular/core';
import {FormControl,FormGroup} from '@angular/forms';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {MdSelectModule} from '@angular/material';
import { QstartMonitorComponent } from './qstart-monitor.component';
import { QstartModemPowerComponent } from './qstart-modem-power.component';
import { QstartMonitorConfigurationComponent } from './qstart-monitor-configuration.component';
import { QstartNewMonitorComponent } from './qstart-new-monitor.component';
import { QstartMonitorPointComponent } from './qstart-monitor-point.component';
import { QstartMonitorDataComponent }  from './qstart-monitor-data.component';

@Component({
    selector: 'qstart',
    templateUrl: './qstart.html', 
})

export class QstartComponent implements OnInit {
    customers: Array<any>;
    selectedQStartCustomer: Object;

    constructor() {
        this.selectedQStartCustomer = {};
    }

    ngOnInit() {
        this.customers = [
            { id: 1, customerName: 'Toronto' },
            { id: 2, customerName: 'Huntsville' }
        ]

        this.selectedQStartCustomer = this.customers[0];
    }

};

