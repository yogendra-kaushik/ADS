import { Http } from '@angular/http';
import { Component, OnInit, Input, Output, Pipe, EventEmitter } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { QstartDataService } from './services/qstart.service';

@Component ({
    selector: 'qstart-monitor-point',
    templateUrl: './qstart-monitor-point.html',
    providers: [QstartDataService]
})

export class QstartMonitorPointComponent {
    @Input() selectedLocation;
    @Input() isConnecting;
    @Output() outputEvent:EventEmitter<Boolean>=new EventEmitter();

    types: Array<any>;
    longRangeDepth: {   depth: number, 
                        range: number, 
                        quality: number, 
                        temperature: number,
                        maximumSignal: number,
                        gain:number,
                        overflow: number,
                        pressureVoltage: number,
                        pressureDepth: number
                    };
    isDisplayedLongRangeDepth: Boolean;

    constructor(private qstartDataService: QstartDataService) {
        this.types = [ 'Pipe: Circular', 'Pipe: Rectangular'];
    }

    ngOnInit() {
        this.isDisplayedLongRangeDepth = false;
    }

    displayLongRangeDepth() {
        this.isDisplayedLongRangeDepth = !this.isDisplayedLongRangeDepth;
        if(this.isDisplayedLongRangeDepth) {
            this.getLongRangeDepth();
        }
    }

    getLongRangeDepth() {
        this.isConnecting = true;
        this.outputEvent.emit(this.isConnecting);

        this.qstartDataService.getLongRangeDepth(55)
            .subscribe(
                result => {
                    this.longRangeDepth = result;

                    this.qstartDataService.disconnectMonitor(55)
                        .subscribe(
                            disconnect => {
                                this.isConnecting = false;
                                this.outputEvent.emit(this.isConnecting);
                            },
                            err=> {
                                console.log("Error: " + err);
                                this.isConnecting = false;
                                this.outputEvent.emit(this.isConnecting);
                            }
                        )
                },
                err => {
                    console.log("Error: " + err);
                    this.isConnecting = false;
                    this.outputEvent.emit(this.isConnecting);
                });   
    }

    onComponentChange(value) {
        this.isConnecting = value;
    }
}