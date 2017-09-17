import {
    Component,
    OnInit,
    OnDestroy,
    Input,
    Output,
    ElementRef,
    EventEmitter,
    OnChanges,
    SimpleChange,
    ChangeDetectorRef,
    NgZone
} from '@angular/core';
import { NavigationService } from '../navigation/navigation.service';
import { Response } from '../../../node_modules/@angular/http/src/static_response';
import { Http } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import { MapComponent } from '../shared/components/map/map.component';
import { LocationDashboardService } from '../shared/services/location-dashboard.service';
import { MapView } from '../shared/models/map-view';
import { MapType } from '../shared/models/map-type';
import { Locations } from '../shared/models/locations';
import { Config } from '../shared/services/config';
import { Customer } from '../shared/models/customer';
import { CustomerService } from '../shared/services/customer.service';
import { BatteryStatusWidgetComponent } from '../pages/battery-status-widget/battery-status-widget.component';
import { LocationGroupService } from '../shared/services/location-group.service';
import { BatteryStatusService } from '../shared/services/battery-status.service';
import { LocationGroup } from '../shared/models/location-group';
import { MdDialog, MdSnackBarRef, SimpleSnackBar, MdSnackBar } from '@angular/material';
import { LocationGroupEditorComponent } from '../locationdashboard/location-group-editor/location-group-editor.component';
import { BatteryTotalCount } from 'app/shared/models/battery-total-count';
import { AutoScrubSummaryService } from '../shared/services/auto-scrub-summary.service';
import { DateutilService } from '../shared/services/dateutil.service';
import { AutoScrubSummaryComponent } from '../pages/auto-scrub-summary/auto-scrub-summary.component';
import { AutoScrubSummary } from 'app/shared/models/auto-scrub-summary';
import { ScheduleCollectionService } from 'app/shared/services/schedule-collection.service';
import { AlarmService } from 'app/shared/services/alarm.service';
import { CollectionWidgetComponent } from '../pages/collection-widget/collection-widget.component';
import { BlockagePredictionService } from 'app/shared/services/blockage-prediction.service';
import { BlockagePrediction } from 'app/shared/models/blockage-prediction';
import { RoundPipe } from 'app/shared/pipes/round.pipe';
import * as Highcharts from 'highcharts';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ActiveAlarm } from 'app/shared/models/active-alarm';
import { IMyOptions, IMyDate } from 'mydatepicker';
import { CollectionHistory } from 'app/shared/models/collection-history';
import { BatteryStatus } from 'app/shared/models/battery-status';
import { LocationService } from 'app/shared/services/location.service';
import { PreLoaderService } from 'app/shared/services/pre-loader.service';
import { LoaderComponent } from 'app/shared/components/loader/loader.component';

@Component({
    selector: 'app-location-dashboard',
    templateUrl: './location-dashboard.component.html',
    styleUrls: ['./location-dashboard.component.scss']
})

export class LocationDashboardComponent implements OnInit, OnDestroy {
    mapViews: MapView[] = [];
    mapTypes: MapType[] = [];
    locations: Locations[];
    filteredLocations: Locations[];
    customerId: number;
    selectedCustomer: any;
    customers: Customer[] = [];
    locationGroups: LocationGroup[] = [];
    selectedLocationGroup: Object;
    locationGroupID: number;
    visibleAlarmWidget: boolean;
    vBATTERY: boolean;
    visibleBlockagePrediction: boolean;
    vAUTO_REVIEW: boolean;
    vCOLLECTION: boolean;
    batteryTotalCount: BatteryTotalCount;
    batteryStatusResults: BatteryStatus[] = [];
    autoReviewCount: number;
    autoScrubSummaryDetails: AutoScrubSummary[];
    errorThreshold = 5;
    message = 'No Locations require data review today.';
    actionLabel = 'Dismiss';
    visibleDataReviewWidget: boolean;
    failedCollection: number;
    upcomingScheduleCollection: string;
    alarmCount: number;
    blockagePredictionCount: number;
    visibleCollectionWidget: boolean;
    blockagePredictionDetails: BlockagePrediction[] = [];
    private index = 1;
    pageSize = 10;
    activeAlarms: ActiveAlarm[] = [];
    showMap = true;
    showAlarmSearch: boolean;
    showBlockagePredictionSearch: boolean;
    showAlarmColumn: boolean;
    collectionHistory: CollectionHistory[];
    showAutoReviwSearch: boolean;
    showBatteryStatusSearch: boolean;
    showCollectionSearch: boolean;
    showCollectionColumn: boolean;
    private subscriptions = new Array<Subscription>();
    alarmLoadingState: boolean;
    batteryLoadingState: boolean;
    bpLoadingState: boolean;
    autoReviewLoadingState: boolean;
    collectionLoadingState: boolean;
    mapLoadingState: boolean;

    /*date picker*/
    startDate: any = { date: { year: (new Date()).getFullYear(), month: this.getPreviousMonth(), day: this.getDay() } };
    endDate: any = { date: { year: (new Date()).getFullYear(), month: (new Date()).getMonth() + 1, day: (new Date()).getDate() } };

    public myDatePickerOptions: IMyOptions = {
        dateFormat: 'mm/dd/yyyy',
        disableSince: <IMyDate>{ year: (new Date()).getFullYear(), month: (new Date()).getMonth() + 1, day: (new Date()).getDate() + 1 },
    };

    getDay() {
        let date = new Date();
        date.setDate(date.getDate() - 1);
        return date.getDate();
    }

    getPreviousMonth() {
        let date = new Date();
        date.setDate(date.getDate() - 1);
        return (date.getMonth() + 1);
    }

    constructor(private locationDashboardService: LocationDashboardService,
        private customerService: CustomerService,
        private locationGroupService: LocationGroupService,
        private _dialog: MdDialog,
        private batteryStatusService: BatteryStatusService,
        private autoScrubSummaryService: AutoScrubSummaryService,
        private dateutilService: DateutilService,
        private _snackBar: MdSnackBar,
        private cdr: ChangeDetectorRef,
        private scheduleCollectionService: ScheduleCollectionService,
        private alarmService: AlarmService,
        private blockagePredictionService: BlockagePredictionService,
        private element: ElementRef,
        private locationService: LocationService,
        private preloaderService: PreLoaderService) {

        this.subscriptions.push(this.customerService.customerChange.subscribe((customerId: number) => this.onCustomerChange(customerId)));
        this.subscriptions.push(this.locationGroupService.locationGroupChange.subscribe((locationGroupId: number) =>
            this.onLocationGroupChange(locationGroupId)));
        this.subscriptions.push(this.locationService.locationsChange.subscribe((locationIds: number[]) =>
            this.onLocationsChange(locationIds)));
    }

    ngOnInit() {
        let subscriptionGetCustomers = this.customerService.getCustomers(true).subscribe(res => {
            if (res === undefined) {

            } else {
                this.customers = res;
                this.customerId = this.customers[0].customerID;
                this.getMapView({});
                this.getMapTypes({});
                this.getLocations({});

                this.onCustomerChange(this.customers[0].customerID);
            }
        });
        this.subscriptions.push(subscriptionGetCustomers);
        this.showBatteryStatusSearch = false;
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    getMapView(data) {
        this.subscriptions.push(this.locationDashboardService.getMapViews().subscribe(
            result => {
                this.mapViews = <MapView[]>result;
            }
        ));
    }

    getMapTypes(data) {
        this.subscriptions.push(this.locationDashboardService.getMapTypes().subscribe(
            result => {
                this.mapTypes = <MapType[]>result;
            }
        ));
    }

    openDataReviewSnackBarDialog() {
        let snackbarRef: MdSnackBarRef<SimpleSnackBar> = this._snackBar.open(this.message, this.actionLabel);
        setTimeout(snackbarRef.dismiss.bind(snackbarRef), 3000);
    }

    openBlockagePredictionSnackBarDialog() {
        let snackbarRef: MdSnackBarRef<SimpleSnackBar> = this._snackBar.open('No blockages predicted today', this.actionLabel);
        setTimeout(snackbarRef.dismiss.bind(snackbarRef), 3000);
    }

    onLocationGroupChange(locationGroupId: number) {
        this.batteryLoadingState = true;
        this.bpLoadingState = true;
        this.autoReviewLoadingState = true;
        this.collectionLoadingState = true;
        this.mapLoadingState = true;

        this.locationGroupID = this.locationGroupService.locationGroupID;
        if (this.locationGroupID !== null && this.customerId !== undefined) {
            // get the updated location based on locationGroupId
            let subscriptionGetLocations = this.locationDashboardService.getLocations(this.customerId, this.locationGroupID).subscribe(
                res => {
                    this.locations = res;
                    this.filteredLocations = this.locations;
                    this.showMap = false;
                    this.mapLoadingState = false;
                    this.locationService.locationIDs = this.locations.map(element => element.locationId);
                    this.loadMap();
                    this.getActiveAlarms(this.locationGroupID);
                    this.getCollectionHistory(this.locationGroupID);
                    this.getAutoScrubSummary(this.locationGroupID);
                    this.getBlockagePredictionWidget(this.locationGroupID);

                }, error => this.mapLoadingState = false
            );
            this.subscriptions.push(subscriptionGetLocations);

            // Battery tiles count on locationGroupChange.
            let subscriptionGetBatteryStatusTotal = this.batteryStatusService.getBatteryStatusTotal(this.customerId, this.locationGroupID).subscribe(
                res => {
                    this.batteryTotalCount = res;
                    this.batteryLoadingState = false;
                }, error => {
                    this.batteryLoadingState = false;
                }
            );
            this.subscriptions.push(subscriptionGetBatteryStatusTotal);

            // Auto-Review tiles count on locationGroupChange.
            let subscriptionGetAutoDetectCount = this.autoScrubSummaryService.getAutoDetectCount(this.customerId, this.locationGroupID,
                this.dateutilService.formatStartDate(this.dateutilService.startDate),
                this.dateutilService.formatEndDatePreviousDay(this.dateutilService.startDate)).subscribe(
                res => {
                    this.autoReviewCount = res;
                    this.autoReviewLoadingState = false;
                }
            );
            this.subscriptions.push(subscriptionGetAutoDetectCount);

            // Collections tiles count on locationGroupChange.
            let subscriptionGetFailedCollection = this.scheduleCollectionService.getFailedCollection(this.customerId, this.locationGroupID).subscribe(
                res => {
                    this.failedCollection = res;
                    this.collectionLoadingState = false;
                }, error => this.collectionLoadingState = false
            );
            this.subscriptions.push(subscriptionGetFailedCollection);

            // get blockage-prediction count for locationGroup change.
            let subscriptionGetBlockagePRedictionCount = this.blockagePredictionService.getBlockagePredictionCount(this.customerId,
                this.dateutilService.formatStartDate(this.dateutilService.startDate),
                this.dateutilService.formatEndDate(this.dateutilService.endDate), this.locationGroupID).subscribe(
                res => {
                    this.blockagePredictionCount = res;
                    this.bpLoadingState = false;
                }, error => this.bpLoadingState = false
            );
            this.subscriptions.push(subscriptionGetBlockagePRedictionCount);

            let subscriptionGetAlarmCount = this.alarmService.getAlarmCount(this.customerId,
                this.dateutilService.formatStartDate(this.dateutilService.startDate),
                this.dateutilService.formatEndDate(this.dateutilService.endDate), this.locationGroupID).subscribe(
                res => {
                    this.alarmCount = res;
                    this.alarmLoadingState = false;
                }, error => {
                    this.alarmLoadingState = false;
                }
            );
            this.subscriptions.push(subscriptionGetAlarmCount);
        }
    }


    onCustomerChange(customerId: number) {
        this.alarmLoadingState = true;
        this.batteryLoadingState = true;
        this.bpLoadingState = true;
        this.autoReviewLoadingState = true;
        this.collectionLoadingState = true;
        this.mapLoadingState = true;

        this.customerId = this.customerService.customerId;
        this.locationGroups = null;
        this.locationGroupID = null;
        if (this.customerId !== null) {
            // initializing location-group drop-down.
            let subscriptionGetLocationGroups = this.locationGroupService.getLocationGroups(this.customerId).subscribe(res => {
                if (res === undefined) {
                } else {
                    this.locationGroups = res.locationGroups;
                }
            });
            this.subscriptions.push(subscriptionGetLocationGroups);

            // get the location for selected customers.
            let subscriptionGetLocations = this.locationDashboardService.getLocations(this.customerId).subscribe(
                res => {
                    this.locations = res;
                    this.filteredLocations = this.locations;
                    this.showMap = false;
                    this.locationService.locationIDs = this.locations.map(element => element.locationId);
                    this.loadMap();
                    this.mapLoadingState = false;
                    let subscription3 = this.batteryStatusService.getBatteryStatus(this.customerId).subscribe(response => {
                        this.batteryStatusResults = response;
                        if (this.vBATTERY) {
                            this.showMap = false;
                            this.locationService.locationIDs = this.batteryStatusResults.map(element => element.locationID);
                            this.loadMap();
                        }
                    });
                    this.subscriptions.push(subscription3);

                    this.getBlockagePredictionWidget();
                    this.getActiveAlarms();
                    this.getCollectionHistory();
                    this.getAutoScrubSummary();
                }, error => this.mapLoadingState = false
            );
            this.subscriptions.push(subscriptionGetLocations);

            // update the criticle and low battery status on tiles.
            let subscriptionGetBatteryStatusTotal = this.batteryStatusService.getBatteryStatusTotal(this.customerId).subscribe(
                res => {
                    this.batteryTotalCount = res;
                    this.batteryLoadingState = false;
                }, error => {
                    this.batteryLoadingState = false;
                }
            );
            this.subscriptions.push(subscriptionGetBatteryStatusTotal);

            // update the autoReview on tiles
            let subscriptionGetAutoDetectCount = this.autoScrubSummaryService.getAutoDetectCount(this.customerId, 0,
                this.dateutilService.formatStartDate(this.dateutilService.startDate),
                this.dateutilService.formatEndDatePreviousDay(this.dateutilService.startDate)).subscribe(
                res => {
                    this.autoReviewCount = res;
                    this.autoReviewLoadingState = false;
                }, error => this.autoReviewLoadingState = false
            );

            this.subscriptions.push(subscriptionGetAutoDetectCount);

            // update the collection on tiles
            let subscriptionGetFailedCollection = this.scheduleCollectionService.getFailedCollection(this.customerId).subscribe(
                res => {
                    this.failedCollection = res;
                    this.collectionLoadingState = false;
                }, error => this.collectionLoadingState = false
            );
            this.subscriptions.push(subscriptionGetFailedCollection);

            // update the collection on tiles
            let subscriptionGetUpcomingCollection = this.scheduleCollectionService.getUpcomingCollection(this.customerId).subscribe(
                res => {
                    this.upcomingScheduleCollection = res;
                    this.collectionLoadingState = false;
                }, error => this.collectionLoadingState = false
            );
            this.subscriptions.push(subscriptionGetUpcomingCollection);

            // tslint:disable-next-line:max-line-length
            let subscriptionGetAlarmCount = this.alarmService.getAlarmCount(this.customerId,
                this.dateutilService.formatStartDate(this.dateutilService.startDate),
                this.dateutilService.formatEndDate(this.dateutilService.endDate)).subscribe(
                res => {
                    this.alarmCount = res;
                    this.alarmLoadingState = false;
                }, error => {
                    this.alarmLoadingState = false;
                }
            );
            this.subscriptions.push(subscriptionGetAlarmCount);

            // tslint:disable-next-line:max-line-length
            let subscriptionGetBlockagePRedictionCount = this.blockagePredictionService.getBlockagePredictionCount(this.customerId,
                this.dateutilService.formatStartDate(this.dateutilService.startDate),
                this.dateutilService.formatEndDate(this.dateutilService.endDate)).subscribe(
                res => {
                    this.blockagePredictionCount = res;
                    this.bpLoadingState = false;
                }, error => this.bpLoadingState = false
            );
            this.subscriptions.push(subscriptionGetBlockagePRedictionCount);
        }
    }

    private getBlockagePredictionWidget(locationGroupId?: number) {
        let subscriptionGetBlockagePredictionWidget = this.blockagePredictionService.getBlockagePredictionWidget(this.customerId,
            this.index, this.pageSize, this.dateutilService.formatStartDate(this.dateutilService.startDate),
            this.dateutilService.formatEndDate(this.dateutilService.endDate), locationGroupId).subscribe(
            response => {
                this.blockagePredictionDetails = response;
                this.loadSparkLine();
                if (this.visibleBlockagePrediction) {
                    this.showMap = false;
                    if (this.blockagePredictionDetails === null) {
                        this.blockagePredictionDetails = [];
                    }
                    if (this.blockagePredictionDetails.length === 0) {
                        this.locations = this.filteredLocations;
                    } else {
                        this.locationService.locationIDs = this.blockagePredictionDetails.map(element => element.locationId);
                    }
                    this.loadMap();
                }
            }
        );
        this.subscriptions.push(subscriptionGetBlockagePredictionWidget);
    }

    private getCollectionHistory(locationGroupId?: number) {
        // tslint:disable-next-line:max-line-length
        let subscriptionGetCollectionHistory = this.scheduleCollectionService.getCollectionHistory(this.customerService.customerId, locationGroupId, undefined, this.dateutilService.formatStartDate(this.dateutilService.startDate),
            this.dateutilService.formatEndDate(this.dateutilService.endDate)).subscribe(
            result => {
                this.collectionHistory = result;
                this.scheduleCollectionService.collectionHistory = this.collectionHistory;
                if (this.visibleCollectionWidget) {
                    this.showMap = false;
                    if (this.collectionHistory.length === 0) {
                        this.locations = this.filteredLocations;
                    } else {
                        this.locationService.locationIDs = this.collectionHistory.map(element => element.locationid);
                    }
                    this.loadMap();
                }
            }
        );
        this.subscriptions.push(subscriptionGetCollectionHistory);
    }

    private getActiveAlarms(locationGroupId?: number) {
        this.alarmLoadingState = true;
        let subscriptionGetActiveAlarm = this.alarmService.getActiveAlarm(this.customerId, locationGroupId).subscribe(
            res => {
                this.activeAlarms = res;
                this.alarmLoadingState = false;
                this.alarmService.activeAlarms = this.activeAlarms;
                if (this.visibleAlarmWidget) {
                    this.showMap = false;
                    if (this.activeAlarms.length === 0) {
                        this.locations = this.filteredLocations;
                    } else {
                        this.locationService.locationIDs = this.activeAlarms.map(element => element.locationID);
                    }
                    this.loadMap();
                }
            }, error => {
                this.alarmLoadingState = false;
            }
        );
        this.subscriptions.push(subscriptionGetActiveAlarm);
    }

    private getAutoScrubSummary(locationGroupId?: number) {
        let subscriptionGetAutoScrubSummary = this.autoScrubSummaryService.getAutoScrubSummary(undefined, this.customerId,
            this.dateutilService.formatStartDate(this.dateutilService.startDate),
            this.dateutilService.formatEndDatePreviousDay(this.dateutilService.startDate), this.errorThreshold, locationGroupId).subscribe(
            response => {
                this.autoScrubSummaryDetails = response;
                if (response === null) {
                    this.autoScrubSummaryDetails = [];
                }

                for (let autoReviewDetail of this.autoScrubSummaryDetails) {
                    if (autoReviewDetail.status === 'ANOMALY') {
                        autoReviewDetail.displayStatus = 'Review Required';
                    } else {
                        if (autoReviewDetail.status === 'OKAY') {
                            autoReviewDetail.displayStatus = 'GOOD';
                        }
                    }
                }
                this.autoScrubSummaryService.autoScrubSummaryDetails = this.autoScrubSummaryDetails;
                if (this.visibleDataReviewWidget) {
                    this.showMap = false;
                    if (this.autoScrubSummaryDetails.length === 0) {
                        this.locations = this.filteredLocations;
                    } else {
                        this.locationService.locationIDs = this.autoScrubSummaryDetails.map(element => element.locationId);
                    }
                    this.loadMap();
                }
            }
        );
        this.subscriptions.push(subscriptionGetAutoScrubSummary);
    }

    onLocationsChange(locationIds: number[]) {
        let filteredMarkers = [];
        for (let locationId of locationIds) {
            filteredMarkers.push(this.filteredLocations.find(location => location.locationId === locationId));
        }
        this.locations = filteredMarkers;
        this.locations.sort((a: any, b: any) => {
            let alocationName = a.locationName.toLowerCase();
            let blocationName = b.locationName.toLowerCase();

            if (alocationName < blocationName) {
                return -1;
            } else if (alocationName > blocationName) {
                return 1;
            } else {
                return 0;
            }
        });
    }

    getLocations(data) {
        if (this.customerService.customerId != null) {
            let customerId = this.customerService.customerId;
            this.subscriptions.push(this.locationDashboardService.getLocations(this.customerId).subscribe(
                result => {
                    this.locations = <Locations[]>result;
                }
            ));
        }
    }

    // method is used to close tiles widget.
    closeWidget() {
        this.visibleDataReviewWidget = false;
        this.visibleAlarmWidget = false;
        this.vBATTERY = false;
        this.visibleBlockagePrediction = false;
        this.visibleCollectionWidget = false;
        this.showMap = false;
        this.locations = this.filteredLocations;
        this.loadMap();
    }

    public showDataReviewWidget() {
        this.showMap = true;
        this.showAutoReviwSearch = false;
        this.visibleDataReviewWidget = true;
        this.visibleAlarmWidget = false;
        this.vBATTERY = false;
        this.visibleBlockagePrediction = false;
        this.visibleCollectionWidget = false;
        this.showMap = false;
        if (this.autoScrubSummaryService.autoScrubSummaryDetails && this.autoScrubSummaryService.autoScrubSummaryDetails.length > 0) {
            this.locationService.locationIDs = this.autoScrubSummaryService.autoScrubSummaryDetails.map(element => element.locationId);
        } else {
            this.locations = this.filteredLocations;
        }
        this.loadMap();
    }

    public showBlockagePredictionwWidget() {
        this.showMap = true;
        this.showBlockagePredictionSearch = false;
        this.loadSparkLine();
        this.visibleDataReviewWidget = false;
        this.visibleBlockagePrediction = true;
        this.visibleAlarmWidget = false;
        this.vBATTERY = false;
        this.visibleCollectionWidget = false;
        this.showMap = false;
        if (this.blockagePredictionDetails && this.blockagePredictionDetails.length > 0) {
            this.locationService.locationIDs = this.blockagePredictionDetails.map(element => element.locationId);
        } else {
            this.locations = this.filteredLocations;
        }
        this.loadMap();

    }

    public showCollectionWidget() {
        this.showMap = true;
        this.showCollectionSearch = false;
        this.showCollectionColumn = false;
        this.visibleCollectionWidget = true;
        this.visibleDataReviewWidget = false;
        this.visibleAlarmWidget = false;
        this.vBATTERY = false;
        this.visibleBlockagePrediction = false;
        this.showMap = false;
        if (this.scheduleCollectionService.collectionHistory.length === 0) {
            this.locations = this.filteredLocations;
        } else {
            this.locationService.locationIDs = this.scheduleCollectionService.collectionHistory.map(element => element.locationid);
        }
        this.loadMap();
    }

    public showAlarmWidget() {
        this.showMap = true;
        this.showAlarmSearch = false;
        this.showAlarmColumn = false;
        this.visibleCollectionWidget = false;
        this.visibleDataReviewWidget = false;
        this.visibleAlarmWidget = true;
        this.vBATTERY = false;
        this.visibleBlockagePrediction = false;
        this.showMap = false;
        if (this.alarmService.activeAlarms && this.alarmService.activeAlarms.length > 0) {
            this.locationService.locationIDs = this.alarmService.activeAlarms.map(element => element.locationID);
        } else {
            this.locations = this.filteredLocations;
        }
        this.loadMap();
    }


    loadSparkLine() {
        window.setTimeout(() => {
            this.displayDepthAndStatusGraph();
        }, 10);
    }

    displayDepthAndStatusGraph() {

        Highcharts.SparkLine = function (a, b, c) {
            let hasRenderToArg = typeof a === 'string' || a.nodeName,
                options = arguments[hasRenderToArg ? 1 : 0],
                defaultOptions = {
                    chart: {
                        renderTo: (options.chart && options.chart.renderTo) || this,
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
                    colors: ['#3F51B5'],
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
                        tickPositions: [],
                        gridLineColor: 'black',
                        lineColor: 'white',
                        minorGridLineColor: 'black',
                        tickColor: 'black',
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
                        enabled: false
                    },
                    plotOptions: {
                        series: {
                            animation: false,
                            lineWidth: 1,
                            shadow: false,
                            states: {
                                hover: {
                                    enabled: false
                                }
                            },
                            marker: {
                                radius: 1,
                                states: {
                                    hover: {
                                        enabled: false
                                    }
                                }
                            },
                            fillOpacity: 0.25
                        },
                        column: {
                            negativeColor: 'green',
                            color: '#f0ad4e',
                            borderColor: 'silver'
                        }
                    }
                };

            options = Highcharts.merge(defaultOptions, options);

            return hasRenderToArg ?
                new Highcharts.Chart(a, options, c) :
                new Highcharts.Chart(options, b);
        };

        // retireve node ist or use default object
        let rows: NodeList = this.element.nativeElement.querySelectorAll('td[data-sparkline]') || {};

        for (let i = 0; i < rows.length; i += 1) {

            // get reference to the row
            let row: Node = rows[i];

            // ensure the row has attrbute data
            if (!row.hasAttributes() && row.attributes['data-sparkline'] === undefined) {
                return;
            }

            // get the chart data from the nodes data attribute
            let stringdata: string = row.attributes['data-sparkline'].value || '';

            // ensure that data was retrieved from data attribute
            if (stringdata === '') {
                return;
            }

            // convert string data to array - not yet sure why we have to do this step but perhaps this is being reused somehow???
            let arr: Array<string> = stringdata.split('; ');

            // convert the data in the array to floating points
            let data: Array<number> = arr[0].split(',').map((value: string) => Number(value));

            // setup chart
            let chart = {
                renderTo: row
            };

            // if arr has a second element, set the value of the second element to the type of the chart
            if (arr[1]) {
                chart['type'] = arr[1];
            }

            // build chart
            // tslint:disable-next-line:no-unused-expression
            new Highcharts.SparkLine({
                chart: chart,
                series: [{
                    data: data,
                    pointStart: 1
                }],
            });
        }
    }

    openleaderBoard(lBId: number) {
        this.visibleAlarmWidget = false;
        this.vBATTERY = false;
        this.visibleBlockagePrediction = false;
        this.vAUTO_REVIEW = false;
        this.visibleCollectionWidget = false;
        this.visibleDataReviewWidget = false;
        if (lBId === 1) {
            this.visibleAlarmWidget = true;
        } else if (lBId === 2) {
            this.vBATTERY = true;
            this.showMap = false;
            // Config.locationIDs = this.batteryStatusResults.map(element => element.locationID);
            this.loadMap();
        } else if (lBId === 3) {
            this.visibleBlockagePrediction = true;
        } else if (lBId === 4) {
            this.vAUTO_REVIEW = true;
        } else if (lBId === 5) {
            this.visibleCollectionWidget = true;
        }
    }

    showLocationMap(event) {
        this.showMap = event;
    }

    showAlarmSearchPanel() {
        this.showAlarmSearch = !this.showAlarmSearch;
    }

    showSearchAlarm(event) {
        this.showAlarmSearch = event;
    }
    expandAlarm() {
        this.showMap = false;
        this.showAlarmColumn = true;
    }

    showBatteryStatus() {
        this.showBatteryStatusSearch = !this.showBatteryStatusSearch;
    }

    onHideBatteryStatusSearch(value: boolean) {
        this.showBatteryStatusSearch = value;
    }

    collapseAlarm() {
        this.showMap = true;
        this.showAlarmColumn = true;
        if (this.alarmService.activeAlarms.length === 0) {
            this.locations = this.filteredLocations;
        } else {
            this.locationService.locationIDs = this.alarmService.activeAlarms.map(element => element.locationID);
        }
        this.loadMap();
        setTimeout(() => {
            this.showAlarmColumn = false;
        }, 10);
    }

    public showBlockagePredictionSearchPanel() {
        this.showBlockagePredictionSearch = !this.showBlockagePredictionSearch;
    }

    public showSearchBlockagePrediction(event) {
        this.showBlockagePredictionSearch = event;
    }

    showCollectionSearchPanel() {
        this.showCollectionSearch = !this.showCollectionSearch;
    }
    showSearchCollection(event) {
        this.showCollectionSearch = event;
    }
    expandCollection() {
        this.showMap = false;
        this.showCollectionColumn = true;
    }
    collapseCollection() {
        this.showMap = false;
        if (this.scheduleCollectionService.collectionHistory.length === 0) {
            this.locations = this.filteredLocations;
        } else {
            this.locationService.locationIDs = this.scheduleCollectionService.collectionHistory.map(element => element.locationid);
        }
        this.loadMap();
        this.showCollectionColumn = false;
    }

    showAutoReviwSearchPanel() {
        this.showAutoReviwSearch = !this.showAutoReviwSearch;
    }
    showSearchAutoReviw(event) {
        this.showAutoReviwSearch = event;
    }
    expandAutoReviw() {
        this.showMap = false;
    }
    collapseAutoReviw() {
        this.showMap = false;
        if (this.autoScrubSummaryService.autoScrubSummaryDetails && this.autoScrubSummaryService.autoScrubSummaryDetails.length > 0) {
            this.locationService.locationIDs = this.autoScrubSummaryService.autoScrubSummaryDetails.map(element => element.locationId);
        } else {
            this.locations = this.filteredLocations;
        }
        this.loadMap();
    }

    loadMap() {
        setTimeout(() => {
            this.showMap = true;
        }, 10);
    }
}

