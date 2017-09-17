import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { Config } from '../../shared/services/config';
import { AlarmService } from '../../shared/services/alarm.service';
import { DateutilService } from '../../shared/services/dateutil.service';
import * as Highcharts from 'Highcharts';
import { ColorBrewer } from '../../shared/services/color.brewer';
import { Global } from '../../shared/services/global';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { CustomerService } from 'app/shared/services';
import { AutoScrubSummaryService } from 'app/shared/services/auto-scrub-summary.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'alarm-graph',
    templateUrl: './alarm-graph.component.html',
    styleUrls: ['./alarm-graph.component.scss']
})
export class AlarmGraphComponent implements OnInit, OnDestroy {
    status: number;
    options: any;
    chart: any;
    showHydrograph: boolean;
    loading = {
        hydrograph: false
    };
    noHydroDataFound: boolean;
    hydroLocationName: string;
    colors = {
        colorScattWormCursorPoint: 'rgba(200, 0, 0, 1)',
        colorScattWormCursorBefore: 'rgba(255, 255, 102, 1)',
        colorScattWormCursorAfter: 'rgba(255, 0, 255, 1)',
        colorHydPlotBandCursorBefore: 'rgba(255, 255, 102, .5)',
        colorHydPlotBandCursorAfter: 'rgba(255, 0, 255, .5)',
        colorScattWormLeaveBehindBefore: 'rgba(51, 102, 255, 1)',
        colorScattWormLeaveBehindAfter: 'rgba(255, 0, 102, 1)',
        colorHydPlotBandLeaveBehindBefore: 'rgba(51, 102, 255, .5)',
        colorHydPlotBandLeaveBehindAfter: 'rgba(255, 0, 102, .5)'
    };
    private subscriptions = new Array<Subscription>();

    constructor(
        private alarmService: AlarmService,
        private dateutilService: DateutilService,
        @Inject(MD_DIALOG_DATA) private data: any,
        public dialogRef: MdDialogRef<AlarmGraphComponent>,
        private customerService: CustomerService,
        private autoScrubSummaryService: AutoScrubSummaryService
    ) {
    }

    ngOnInit() {
        if (this.data.graphpage === 'autoReview') {
            this.showHydrograph = false;
            this.hydroLocationName = this.data.locationName;
            // tslint:disable-next-line:max-line-length
            let subscription = this.autoScrubSummaryService.getAutoScrubDetails(this.data.locationId, this.customerService.customerId, this.dateutilService.formatStartDate(this.data.startDate), this.dateutilService.formatEndDate(this.data.endDate)).subscribe(res => {
                if (res !== null && res.length > 0) {
                    this.noHydroDataFound = false;
                    let depthData = [];
                    let velocityData = [];
                    for (let item of res) {
                        let milliseconds = (new Date(item.ts)).getTime();
                        let depthPoint = [milliseconds, item.E.U];
                        let velocityPoint = [milliseconds, item.E.V];
                        depthData.push(depthPoint);
                        velocityData.push(velocityPoint);
                    }
                    this.showHydrograph = true;
                    this.loading.hydrograph = true;
                    // this.chartService.clearChartData();
                    this.initChartAutoReview(depthData, velocityData);

                    this.loading.hydrograph = false;
                } else {
                    this.noHydroDataFound = true;
                    this.showHydrograph = true;
                }


            });
            this.subscriptions.push(subscription);

        } else {
            let alarmStartDate;
            let alarmEndDate: any = {
                date: {
                    month: this.data.endDate.getMonth() + 1, day: this.data.endDate.getDate(), year: this.data.endDate.getFullYear()
                }
            };
            alarmStartDate = this.getPreviousAlarmDate(this.data.endDate);
            // tslint:disable-next-line:max-line-length
            alarmStartDate.date = { month: alarmStartDate.getMonth() + 1, day: alarmStartDate.getDate(), year: alarmStartDate.getFullYear() };
            this.showHydrograph = false;
            // tslint:disable-next-line:max-line-length
            let subscription = this.alarmService.getHydrograph(this.customerService.customerId, this.data.locationId, this.dateutilService.formatStartDate(alarmStartDate), this.dateutilService.formatEndDate(alarmEndDate)).subscribe(res => {
                if (res !== null) {
                    this.hydroLocationName = res.title;
                    this.noHydroDataFound = false;
                    let depthData = [];
                    let velocityData = [];
                    let flowData = [];
                    let rainData = [];

                    for (let entityData of res.displayGroups[0].entityData) {
                        let milliseconds = (new Date(entityData.ts)).getTime();
                        let depthPoint = [milliseconds, entityData.E[res.displayGroups[0].entityInformation[0].id]];
                        depthData.push(depthPoint);
                    }

                    for (let entityData of res.displayGroups[1].entityData) {
                        let milliseconds = (new Date(entityData.ts)).getTime();
                        let velocityPoint = [milliseconds, entityData.E[res.displayGroups[1].entityInformation[0].id]];
                        velocityData.push(velocityPoint);
                    }

                    for (let entityData of res.displayGroups[2].entityData) {
                        let milliseconds = (new Date(entityData.ts)).getTime();
                        let flowPoint = [milliseconds, entityData.E[res.displayGroups[2].entityInformation[0].id]];
                        flowData.push(flowPoint);
                    }

                    for (let entityData of res.displayGroups[3].entityData) {
                        let milliseconds = (new Date(entityData.ts)).getTime();
                        let rainPoint = [milliseconds, entityData.E[res.displayGroups[3].entityInformation[0].id]];
                        rainData.push(rainPoint);
                    }
                    this.showHydrograph = true;
                    this.loading.hydrograph = true;
                    this.initChart(depthData, velocityData, flowData, rainData);
                    this.loading.hydrograph = false;
                } else {
                    this.noHydroDataFound = true;
                    this.showHydrograph = true;
                }
            });
            this.subscriptions.push(subscription);
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    /**
  * Initializes the Hydrograph.
  * @param depthData - Data Array for depth series in hydrograph.
  * @param velocityData - Data Array for velocity series in hydrograph.
  * @param flowData - Data Array for flow series in hydrograph.
  * @param rainData - Data Array for rain series in hydrograph.
  */
    initChart(depthData, velocityData, flowData, rainData) {
        this.options = {
            global: {
                useUTC: false,
            },
            tooltip: {
                hideDelay: 0,
                enabled: true,
                shared: true,
                crosshairs: true
                /*,
                positioner: function (boxWidth, boxHeight, point) {
                  let t = this;
                  return { x: point.plotX, y: 20 };
                }*/
            },
            legend: {
                align: 'center',
                verticalAlign: 'top',
                layout: 'horizontal',
                x: 0,
                y: 12
            },

            chart: {
                // renderTo: 'hydrograph_container',
                renderTo: 'highChartIdAuto',
                defaultSeriesType: 'line',
                zoomType: 'x',
                events: {
                    click: function (event) {
                        let clickedX = event.xAxis[0].value;
                        let clickedXRnd = Math.round(clickedX);
                    },
                    redraw: function (e) {
                        this.redrawCount++;
                    },
                    selection: function (event) {
                        this.onChartSelection(event);
                    }
                }
            },

            plotOptions: {
                column: { groupPadding: 0, pointPadding: 0, pointWidth: 1, borderWidth: 0, shadow: false },
                line: { lineWidth: 0.5 },
                series: {
                    events: {
                        mouseOver: function (e) {
                            console.log('series mouse over.');
                            console.log(e);
                        }
                    },
                    allowPointSelect: true,
                    marker: {
                        states: {
                            select: {
                                fillColor: 'red',
                                radius: 6,
                                lineWidth: 0
                            },
                            hover: {
                                enabled: false,
                                lineWidth: 2
                            }
                        }

                    },
                    states: {
                        hover: {
                            enabled: false
                        }
                    },

                    point: {
                        events: {
                            mouseOver: function () {
                                console.log('point mouse over called.');
                            }
                        }
                    },
                }
            },
            xAxis: {
                type: 'datetime',
                labels: {
                    'format': '{value: %e, %b }'
                },
                tickInterval: 24 * 3600 * 1000,
                ordinal: false,
                plotBands: [
                    {
                        // mark the weekend
                        color: this.colors.colorHydPlotBandCursorBefore,
                        from: 0,
                        to: 0,
                        id: 'plotBandCursorWormBefore'
                    },
                    {
                        // mark the weekend
                        color: this.colors.colorHydPlotBandCursorAfter,
                        from: 0,
                        to: 0,
                        id: 'plotBandCursorWormAfter'
                    }
                ],
            },
            yAxis: [
                { allowDecimals: true, opposite: true, title: { text: 'Depth (in)' }, top: '0%', height: '95%', min: 0 },
                { allowDecimals: true, title: { text: 'Velocity (ft/s)' }, top: '0%', height: '95%', min: 0 },
                { allowDecimals: true, title: { text: 'Flow (MGD)' }, top: '0%', height: '95%', min: 0 },
                { allowDecimals: true, title: { text: 'Rain (in)' }, top: '0%', height: '95%', min: 0 }
            ],
            scrollbar: {
                enabled: false,
                liveRedraw: false,
            },
            navigator: { enabled: false, margin: 0 },
            series: [
                {
                    name: 'Depth', type: 'line',
                    data: depthData,
                    yAxis: 0, color: ColorBrewer.Greens[9][6], dataGrouping: { enabled: false }, zIndex: 5, lineWidth: 1.5
                },
                {
                    name: 'Velocity', type: 'line',
                    data: velocityData,
                    yAxis: 1, color: ColorBrewer.Reds[9][6], dataGrouping: { enabled: false }, zIndex: 5, lineWidth: 1.5
                },
                {
                    name: 'Flow', type: 'line',
                    data: flowData,
                    yAxis: 2, color: ColorBrewer.Blues[9][6], dataGrouping: { enabled: false }, zIndex: 5, lineWidth: 1.5
                },
                {
                    name: 'Rain', type: 'column',
                    data: rainData,
                    yAxis: 3, color: ColorBrewer.Oranges[9][6], dataGrouping: { enabled: false }, zIndex: 5, lineWidth: 1.5
                }
            ],
            rangeSelector: {
                enabled: false
            }
        };

        Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });
    }
    /**
     * Initializes the Hydrograph.
     * @param depthData - Data Array for depth series in hydrograph.
     * @param velocityData - Data Array for velocity series in hydrograph.
     */
    initChartAutoReview(depthData, velocityData) {
        this.options = {
            global: {
                useUTC: false,
            },
            tooltip: {
                hideDelay: 0,
                enabled: true,
                shared: true,
                crosshairs: true
                /*,
                positioner: function (boxWidth, boxHeight, point) {
                  let t = this;
                  return { x: point.plotX, y: 20 };
                }*/
            },
            legend: {
                align: 'center',
                verticalAlign: 'top',
                layout: 'horizontal',
                x: 0,
                y: 12
            },

            chart: {
                // renderTo: 'hydrograph_container',
                renderTo: 'highChartIdAuto',
                defaultSeriesType: 'line',
                zoomType: 'x',
                events: {
                    click: function (event) {
                        let clickedX = event.xAxis[0].value;
                        let clickedXRnd = Math.round(clickedX);
                    },
                    redraw: function (e) {
                        this.redrawCount++;
                    },
                    selection: function (event) {
                        this.onChartSelection(event);
                    }
                }
            },

            plotOptions: {
                column: { groupPadding: 0, pointPadding: 0, pointWidth: 1, borderWidth: 0, shadow: false },
                line: { lineWidth: 0.5 },
                series: {
                    events: {
                        mouseOver: function (e) {
                            console.log('series mouse over.');
                            console.log(e);
                        }
                    },
                    allowPointSelect: true,
                    marker: {
                        states: {
                            select: {
                                fillColor: 'red',
                                radius: 6,
                                lineWidth: 0
                            },
                            hover: {
                                enabled: false,
                                lineWidth: 2
                            }
                        }

                    },
                    states: {
                        hover: {
                            enabled: false
                        }
                    },

                    point: {
                        events: {
                            mouseOver: function () {
                                console.log('point mouse over called.');
                            }
                        }
                    },
                }
            },
            xAxis: {
                type: 'datetime',
                labels: {
                    'format': '{value: %b %e  }'
                },
                tickInterval: 24 * 3600 * 1000,
                ordinal: false,
                plotBands: [
                    {
                        // mark the weekend
                        color: this.colors.colorHydPlotBandCursorBefore,
                        from: 0,
                        to: 0,
                        id: 'plotBandCursorWormBefore'
                    },
                    {
                        // mark the weekend
                        color: this.colors.colorHydPlotBandCursorAfter,
                        from: 0,
                        to: 0,
                        id: 'plotBandCursorWormAfter'
                    }
                ],
            },
            yAxis: [
                { allowDecimals: true, opposite: true, title: { text: 'Depth (in)' }, top: '0%', height: '95%', min: 0 },
                { allowDecimals: true, title: { text: 'Velocity (ft/s)' }, top: '0%', height: '95%', min: 0 },
                { allowDecimals: true, title: { text: '' }, top: '0%', height: '95%', min: 0 },
                {
                    labels: { enabled: false }, tickAmount: 0, title: { text: null },
                    showFirstLabel: false, showLastLabel: false, visible: false, top: '0%', height: '47%', min: 0, max: 0.5
                },
                {
                    labels: { enabled: false }, tickAmount: 0, title: { text: null },
                    showFirstLabel: false, showLastLabel: false, visible: false, top: '47%', height: '48%', min: 0, max: 0.5
                }
            ],
            scrollbar: {
                enabled: false,
                liveRedraw: false,
            },
            navigator: { enabled: false, margin: 0 },
            series: [
                {
                    name: 'Depth', type: 'line',
                    data: depthData,
                    yAxis: 0, color: ColorBrewer.Greens[9][6], dataGrouping: { enabled: false }, zIndex: 5, lineWidth: 1.5
                },
                {
                    name: 'Velocity', type: 'line',
                    data: velocityData,
                    yAxis: 1, color: ColorBrewer.Reds[9][6], dataGrouping: { enabled: false }, zIndex: 5, lineWidth: 1.5
                }
            ],
            rangeSelector: {
                enabled: false
            }
        };

        Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });
    }
    /**
     * Saves the chart instance into chart variable after chart is loaded.
     * @param chart - chart instance
     */
    saveChart(chart) {
        this.chart = chart;
    }

    onPointSelect(point) {
    }

    /**
     * It gets called on mouse over of series in Hydrograph.
     * @param point - point of the Hydrograph.
     */
    onSeriesMouseOver(point) {
        let extremes = this.chart.xAxis[0].getExtremes();
        let zoomWidth = extremes.max - extremes.min;
        let zoomWidthInDays = zoomWidth / (24 * 60 * 60 * 1000);

        if (zoomWidthInDays < 93) {
            if (Global.tabState === 'meter') {
                // Don't update cursor worms if not on the D or V traces (0 and 1).
                if (this.chart.series._i > 1) {
                    return;
                }
            }
        }
    }

    /**
     * gets called after set extremes event of Hydrograph HighChart.
     * @param e - event
     */
    onAfterSetExtremesX(e) {
    }

    /**
    * gets called on chart selection event of Hydrograph.
    * @param event - event
    */
    onChartSelection(event: any) {
        if (event.originalEvent.shiftKey === true || event.originalEvent.ctrlKey === true) {
            event.preventDefault();
            // RemoveSelectionPlotBand();;
            let selectState = !event.originalEvent.ctrlKey;
            this.chart.series[0].chart.xAxis[0].addPlotBand({
                // mark the selection
                color: 'rgba(102, 153, 153, .2)',
                from: event.xAxis[0].min,
                to: event.xAxis[0].max,
                id: 'plotBandSelection'
            });
            let startSelectionIndex, endSelectionIndex;
            let chartScatter = $('#scattergraph_container').highcharts();
            for (let i = Global.zoomStartIndex; i < this.chart.series[0].data.length; i++) {
                if (this.chart.series[0].data === undefined) {
                    continue;
                }
                if (this.chart.series[0].data[i].x > event.xAxis[0].min) {
                    startSelectionIndex = i;
                    break;
                }
            }
            for (let i = startSelectionIndex; i < this.chart.series[0].data.length; i++) {
                if (this.chart.series[0].data[i].x === undefined) {
                    continue;
                }
                if (this.chart.series[0].data[i].x > event.xAxis[0].max) {
                    endSelectionIndex = i - 1;
                    break;
                }
            }

            for (let i = startSelectionIndex; i <= endSelectionIndex; i++) {
                let myPoint = chartScatter.series[0].data[i - Global.zoomStartIndex];
                myPoint.select(true, true);
                for (let j = 1; j <= 6; j++) {
                    let myData = chartScatter.series[j].data;
                    for (let k = 0; k < myData.length; k++) {
                        if (myPoint.x === event.context.x) {
                            if (myData[k].y === event.context.y) {
                                myData[i].select(selectState, true);
                                break;
                            }
                        }
                    }
                }
            }
            return false;
        }
    }

    onSeriesHide(series) {
    }


    getPreviousAlarmDate(startDate) {
        let date = new Date(startDate);
        date.setDate(date.getDate() - 2);
        return date;
    }
    emitGraph() {
        this.dialogRef.close({ success: false });
    }
}
