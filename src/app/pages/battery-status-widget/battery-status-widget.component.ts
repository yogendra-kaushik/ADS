import { Component, OnInit, OnChanges, OnDestroy, ChangeDetectorRef, Input, EventEmitter, Output } from '@angular/core';
import { NavigationService } from '../../navigation/navigation.service';
import { Response } from '../../../../node_modules/@angular/http/src/static_response';
import { Http } from '@angular/http';
import { Dictionary } from '../../shared/models/dictionary';
import { Customer, Locations, SelectItem } from '../../shared/models';
import { ChartModule } from 'angular2-highcharts';
import { UUID } from 'angular2-uuid';
import { AutoScrubSummary } from 'app/shared/models/auto-scrub-summary';
import { NgForm } from '@angular/forms';
import { LocationGroupService, BatteryStatusService, LocationService, CustomerService, ColorBrewer } from '../../shared/services';
import { Subscription } from 'rxjs/Subscription';
const Highcharts = require('highcharts');
const Highcharts3d = require('highcharts/highcharts-3d.src');
Highcharts3d(Highcharts);

@Component({
    selector: 'battery-status-widget',
    templateUrl: './battery-status-widget.component.html',
    styleUrls: ['./battery-status-widget.component.scss']
})

export class BatteryStatusWidgetComponent implements OnInit, OnDestroy {
    @Input() public locations = new Array<Locations>();
    @Input() public showBatteryStatusSearch: boolean;
    @Output() onHideBatteryStatusSearch = new EventEmitter<boolean>();
    private customerID: number;
    private locationGroupID: number;
    private subscriptions = new Array<Subscription>();
    private selectedLocation = new Array<SelectItem>();
    private filteredLocations = new Array<SelectItem>();

    public batteryStatusCriticalData = new Array<number>();
    public options: Object;
    public sparkLineCharts = new Array<any>();
    public sparkLineOptions: Object;
    public chart: Object;
    public batteryStatusData = new Array<any>();
    public statuses = new Array<string>();
    public chartData = new Array<any>();
    public sparkLineData = new Array<any>();
    public selectedLocationID: number;
    public selectedStatus: string;
    public selectedVoltage: number;
    public pagedItems = new Array<any>();
    public showPagination: boolean;
    public uuid: UUID;
    public setFirstPage: boolean;

    @Output()
    showMap: EventEmitter<boolean> = new EventEmitter<boolean>();
    batteryWidgetLoadingState: boolean;

    constructor(
        private batteryStatusService: BatteryStatusService,
        private cdr: ChangeDetectorRef,
        private customerService: CustomerService,
        private locationService: LocationService,
        private locationGroupService: LocationGroupService) {
    }

    ngOnInit() {
        this.uuid = UUID.UUID();
        this.customerID = this.customerService.customerId;
        if (this.customerID > 0) {
            this.generateBatteryWidgetTable(this.customerID, this.locationGroupService.locationGroupID);
        }
        this.statuses = ['CRITICAL', 'GOOD', 'LOW', 'UNKNOWN'];
        this.subscriptions.push(this.customerService.customerChange.subscribe(customerID => this.onCustomerChange(customerID)));

        this.subscriptions.push(this.locationGroupService.locationGroupChange.subscribe(x => this.onLocationGroupChange(x)));
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    ngOnChanges() {
        this.populateFilterLocations();
    }

    /*display  pagination*/
    public showPageRecords(pagedItems: any[]) {
        this.pagedItems = pagedItems;
        this.cdr.detectChanges();
    }

    private generateBatteryWidgetGraph(goodBatteryTotal, criticalBatteryTotal, lowBatteryTotal, unknownBatteryTotal) {
        this.chartData = [['GOOD', goodBatteryTotal], ['CRITICAL', criticalBatteryTotal], ['LOW', lowBatteryTotal], ['UNKNOWN', unknownBatteryTotal]];
        this.options = {
            credits: {
                enabled: false
            },
            chart: {
                width: 400,
                height: 240,
                align: 'center'
            },
            title: { text: '' },
            colors: ['#5cb258', '#F44336', '#f99300', '#bfbab2'],
            tooltip: {
                pointFormat: '<b>{point.percentage:.1f}%</b>'
            },
            legend: {
                align: 'right',
                verticalAlign: 'middle',
                layout: 'vertical',
                symbolHeight: 12,
                symbolWidth: 12,
                symbolRadius: 0,
                itemStyle: { 'fontSize': '10px' },
                itemMarginTop: 10,
                labelFormatter: function () {
                    return this.name + '  ' + this.percentage.toFixed(1) + ' %';
                }
            },
            plotOptions: {
                pie: {
                    size: 200,
                    allowPointSelect: true,
                    cursor: 'pointer',
                    depth: 35,
                    dataLabels: {
                        enabled: false,
                    },
                    showInLegend: true
                }
            },
            series: [{
                type: 'pie',
                innerSize: '50%',
                data: this.chartData
            }],
        };
    }

    private generateBatteryWidgetTable(customerID: number, locationGroupID?: number, locationID?: number, voltage?: number, status?: string) {
        this.batteryWidgetLoadingState = true;
        this.batteryStatusCriticalData = [];
        let goodBatteryTotal = 0;
        let criticalBatteryTotal = 0;
        let lowBatteryTotal = 0;
        let unknownBatteryTotal = 0;

        this.subscriptions.push(this.batteryStatusService.getBatteryStatus(customerID, locationGroupID, locationID, voltage, status).subscribe(res => {
            this.batteryStatusData = [];
            this.batteryStatusData = res;

            if (this.batteryStatusData !== null) {
                for (let item of this.batteryStatusData) {
                    if (item.status === 'GOOD') {
                        goodBatteryTotal++;
                    } else if (item.status === 'CRITICAL') {
                        criticalBatteryTotal++;
                        this.batteryStatusCriticalData.push(item.locationID);

                    } else if (item.status === 'LOW') {
                        lowBatteryTotal++;
                        this.batteryStatusCriticalData.push(item.locationID);

                    } else if (item.status === 'UNKNOWN') {
                        unknownBatteryTotal++;
                    }
                }

                this.batteryStatusData.sort((a: any, b: any) => {
                    var aStatus = a.status.toLowerCase();
                    var bStatus = b.status.toLowerCase();

                    if (aStatus === bStatus) {
                        if (a.locationName < b.locationName) {
                            return -1;
                        } else if (a.locationName > b.locationName) {
                            return 1;
                        } else {
                            return 0;
                        }
                        // tslint:disable-next-line:max-line-length
                    } else if ((aStatus === 'unknown') || (aStatus === 'good' && (bStatus === 'critical' || bStatus === 'low')) || (aStatus === 'low' && (bStatus === 'critical')) || (aStatus === 'unknown' && (bStatus === 'low' || bStatus === 'critical'))) {
                        return 1;
                    } else {
                        return -1;
                    }

                });

                /*display  pagination*/
                if (this.batteryStatusData !== undefined && this.batteryStatusData !== null && this.batteryStatusData.length > 10) {
                    this.showPagination = false;
                    this.setFirstPage = true;
                } else {
                    this.showPagination = true;
                }

                this.generateBatteryWidgetGraph(goodBatteryTotal, criticalBatteryTotal, lowBatteryTotal, unknownBatteryTotal);
                this.generateSparkLines();
            }


            this.hideBatteryStatusSearchPanel();
            this.batteryWidgetLoadingState = false;
        }, error => this.batteryWidgetLoadingState = false
        ));
    }

    private generateSparkLines() {
        this.batteryStatusData.forEach(function (item) {
            item['sparkLineOptions'] = {

                chart: {
                    backgroundColor: null,
                    borderWidth: 0,
                    type: 'area',
                    margin: [2, 0, 2, 0],
                    width: 120,
                    height: 20,
                    style: {
                        overflow: 'visible'
                    },

                    // small optimalization, saves 1-2 ms each sparkline
                    skipClone: true
                },
                title: {
                    text: ''
                },
                credits: {
                    enabled: false
                },
                xAxis: {
                    labels: {
                        enabled: false
                    },
                    title: {
                        text: null
                    },
                    startOnTick: false,
                    endOnTick: false,
                    tickPositions: []
                },
                yAxis: {
                    endOnTick: false,
                    startOnTick: false,
                    labels: {
                        enabled: false
                    },
                    title: {
                        text: null
                    },
                    tickPositions: [0]
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    backgroundColor: '#fff',
                    borderColor: '#2196F3',
                    borderWidth: 1,
                    shadow: false,
                    useHTML: true,
                    hideDelay: 0,
                    shared: true,
                    padding: 0,
                    positioner: function (w, h, point) {
                        return { x: point.plotX - w / 2, y: point.plotY - h };
                    },
                    headerFormat: null,
                    pointFormat: '<div style="padding: 10px; font-weight:bold;">{point.y} V</div><div style="padding: 0 10px 10px 10px;">' + item.day + '</div>'

                },
                plotOptions: {
                    series: {
                        animation: false,
                        lineWidth: 2,
                        shadow: false,
                        states: {
                            hover: {
                                lineWidth: 2
                            }
                        },
                        marker: {
                            radius: 1,
                            states: {
                                hover: {
                                    radius: 2
                                }
                            }
                        },
                        fillOpacity: 0.25
                    },
                    column: {
                        negativeColor: '#910000',
                        borderColor: 'silver'
                    },
                },
                series: [{
                    type: 'area',
                    data: item['voltages'].reverse()
                }]

            };
        });

    }

    private onLocationGroupChange(locationgGroupID: number) {
        if (locationgGroupID > 0) {
            this.locationGroupID = locationgGroupID;
            this.generateBatteryWidgetTable(this.customerID, locationgGroupID);
        } else {
            //for group All locations
            this.generateBatteryWidgetTable(this.customerID);
        }
        this.resetBatteryStatusParameters();
        this.hideBatteryStatusSearchPanel();
        if (this.batteryStatusCriticalData.length > 0) {
            this.locationService.locationIDs = this.batteryStatusCriticalData;
        }
    }

    private onCustomerChange(customerID: number) {
        this.uuid = UUID.UUID();
        this.customerID = this.customerService.customerId;
        this.resetBatteryStatusParameters();
        this.hideBatteryStatusSearchPanel();
        this.generateBatteryWidgetTable(customerID);
        if (this.batteryStatusCriticalData.length > 0) {
            this.locationService.locationIDs = this.batteryStatusCriticalData;
        }
    }

    public navigate() {
        window.open('https://store.adsenv.com/', '_blank');
    }

    public hideBatteryStatusSearchPanel() {
        this.onHideBatteryStatusSearch.emit(false);
    }

    public resetBatteryStatusParameters() {
        this.selectedLocationID = null;
        this.selectedStatus = null;
        this.selectedVoltage = null;
        this.selectedLocation = [];
    }

    public refreshValue(value: SelectItem) {
        this.selectedLocation = [];
        this.selectedLocation[0] = value;
        this.selectedLocationID = value.id;
    }

    // populate data from locations array to filteredLocations
    private populateFilterLocations() {
        this.filteredLocations = [];
        this.locations.forEach((location: { locationId: number, locationName: string }) => {
            this.filteredLocations.push({
                id: location.locationId,
                text: location.locationName
            });
        });
    }

    //submit search form
    public onSubmit() {
        this.generateBatteryWidgetTable(this.customerID,
            this.locationGroupID,
            this.selectedLocationID,
            this.selectedVoltage,
            this.selectedStatus);
    }

    public getMarkerLocationDetails(locationId: number) {
        this.locationService.locationId = locationId;
    }
}
