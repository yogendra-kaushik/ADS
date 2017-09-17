import { Component, OnInit, EventEmitter, Output, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import { IMyOptions, IMyDateModel, IMyInputFieldChanged, IMyDate } from 'mydatepicker';
import { ViewDataService } from '../../shared/services/view-data.service';
import { DateutilService } from '../../shared/services/dateutil.service';
import { Config } from '../../shared/services/config';
import { ViewData } from '../../shared/models/view-data';
import { LocationDashboardService } from '../../shared/services/location-dashboard.service';
import { Locations } from '../../shared/models/locations';
import { Global } from '../../shared/services/global';
import { ColorBrewer } from '../../shared/services/color.brewer';
import * as Highcharts from 'Highcharts';
import { CustomerService } from '../../shared/services';
import { MdTabGroup } from '@angular/material';
import { LocationGroupService } from '../../shared/services/location-group.service';
import { ScatterData } from '../../shared/models/scatter-data';
import { OrderByPipe } from 'app/shared';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-view-data',
  templateUrl: './view-data.component.html',
  styleUrls: ['./view-data.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ViewDataComponent implements OnInit, OnDestroy {
  startDate: any = { date: { year: (new Date()).getFullYear(), month: this.getPreviousMonth(), day: this.getDay() } };
  endDate: any = { date: { year: (new Date()).getFullYear(), month: (new Date()).getMonth() + 1, day: (new Date()).getDate() } };
  public myDatePickerOptions: IMyOptions = {
    dateFormat: 'mm/dd/yyyy',
    disableSince: <IMyDate>{ year: (new Date()).getFullYear(), month: (new Date()).getMonth() + 1, day: (new Date()).getDate() + 1 },
  };
  viewData: ViewData;
  scatterData: ScatterData;
  entities: Object[];
  entityId: number[] = [];
  customerId: number;
  locations: Locations[];
  locationId: number;
  resetLocationId: number;
  displayStartDateErrMsg: boolean;
  displayEndDateErrMsg: boolean;
  invalidDateRange: boolean;
  endDateValue: string;
  startDateValue: string;
  invalidStartDate: boolean;
  invalidEndDate: boolean;
  hydroLocationName: string;
  noHydroDataFound: boolean;
  noScatterGraphDataFound: boolean;
  showHydrograph: boolean;
  loading = {
    hydrograph: false
  };
  options: any;
  scatterOptions: any;
  chart: any;
  scatterChart: any;
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

  hydroData: Object[] = [];
  displayDepthName: string;
  displayVelocityName: string;
  displayFlowName: string;
  displayRainName: string;
  checkGraph: boolean;
  locationGroupID: number;
  xAxisLabel: string;
  yAxisLabel: string;
  selectedTab: number;
  startDateValidity: boolean;
  endDateValidity: boolean;
  private subscriptions = new Array<Subscription>();


  constructor(private viewDataService: ViewDataService, private dateutilService: DateutilService,
    private locationDashboardService: LocationDashboardService,
    private customerService: CustomerService,
    private locationGroupService: LocationGroupService) {
    this.customerService.customerChange.subscribe(x => this.loadLocations(x));
    this.locationGroupService.locationGroupChange.subscribe(x => this.onLocationGroupChange(x));
  }
  getDay() {
    let date = new Date();
    date.setDate(date.getDate() - 7);
    return date.getDate();
  }
  getPreviousMonth() {
    let date = new Date();
    date.setDate(date.getDate() - 7);
    return (date.getMonth() + 1);
  }
  ngOnInit() {
    this.checkGraph = false;
    this.entityId = [4122, 4202, 3302, 2123];
    this.entities = [{ text: 'UNIDEPTH', entityId: 4122 }, { text: 'SDEPTH_3', entityId: 4106 },
    { text: 'PDEPTH_1', entityId: 5122 }, { text: 'PDEPTH', entityId: 5104 }, { text: 'LRDEPTH', entityId: 5141 },
    { text: 'PDEPTH_3', entityId: 5124 }, { text: 'UpDEPTH_1', entityId: 5125 }, { text: 'RAWVEL', entityId: 5201 },
    { text: 'VELOCITY', entityId: 4202 }, { text: 'QCONTINUITY', entityId: 3302 }, { text: 'QMANNING', entityId: 3307 },
    { text: 'RAIN', entityId: 2123 }];
    this.loadLocations(this.customerService.customerId);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  displayGraph() {
    this.displayHydroGraph();
    if (this.entityId.length === 0) {
      this.noScatterGraphDataFound = true;
    } else {
      this.displayScatterGraph();
    }
  }
  displayScatterGraph() {
    let subscription = this.viewDataService.getScatterpgraph(this.customerService.customerId, this.locationId,
      this.dateutilService.formatStartDate(this.startDate),
      this.dateutilService.formatEndDate(this.endDate), [4122, 4202]).subscribe(res => {
        this.scatterData = null;
        this.scatterData = res;
        if (this.scatterData !== null) {
          this.xAxisLabel = this.scatterData.xAxis.label;
          this.yAxisLabel = this.scatterData.yAxis.label;
          this.noScatterGraphDataFound = false;
          let depthVelocityData = [];
          let timeStampData = [];

          for (let data of this.scatterData.data) {
            let milliseconds = (new Date(data.dateTime)).getTime();
            let depthPoint = [data.x, data.y];
            depthVelocityData.push(depthPoint);
          }

          this.initScatterChart(depthVelocityData, timeStampData);
        } else {
          this.noScatterGraphDataFound = true;
        }
      }, error => this.handleScatterError(error));
    this.subscriptions.push(subscription);
  }

  handleScatterError(error: any) {
    if (error._body.includes('Unable to load location') || error._body.includes('Invalid location')
      || error._body.includes('Invalid customer')) {
      this.noScatterGraphDataFound = true;
    }
  }

  displayHydroGraph() {
    // tslint:disable-next-line:max-line-length
    let subscription = this.viewDataService.getHydrograph(this.customerService.customerId, this.locationId, this.dateutilService.formatStartDate(this.startDate), this.dateutilService.formatEndDate(this.endDate), this.entityId).subscribe(res => {
      this.viewData = null;
      this.viewData = res;
      if (this.viewData !== null) {
        this.noHydroDataFound = false;
        let depthData = [];
        let pDepth_1Data = [];
        let pDepth_3Data = [];
        let pDepthData = [];
        let sDepth_3Data = [];
        let upDepth_1Data = [];
        let lrDepthData = [];
        let velocityData = [];
        let rawVelData = [];
        let flowData = [];
        let qManningData = [];
        let rainData = [];
        this.displayDepthName = '';
        this.displayFlowName = '';
        this.displayRainName = '';
        this.displayVelocityName = '';
        let timeStamp = [];
        let hydroGroup: Object[];

        for (let displayGroup of this.viewData.displayGroups) {
          for (let entityInformation of displayGroup.entityInformation) {
            if (entityInformation.id === 4122) {
              for (let entityData of displayGroup.entityData) {
                let milliseconds = (new Date(entityData.ts)).getTime();
                let depthPoint = [milliseconds, entityData.E[entityInformation.id]];
                depthData.push(depthPoint);
              }
            } else if (entityInformation.id === 5122) {
              for (let entityData of displayGroup.entityData) {
                let milliseconds = (new Date(entityData.ts)).getTime();
                let pDepthPoint = [milliseconds, entityData.E[entityInformation.id]];
                pDepth_1Data.push(pDepthPoint);
              }
            } else if (entityInformation.id === 4106) {
              for (let entityData of displayGroup.entityData) {
                let milliseconds = (new Date(entityData.ts)).getTime();
                let sDepthPoint = [milliseconds, entityData.E[entityInformation.id]];
                sDepth_3Data.push(sDepthPoint);
              }
            } else if (entityInformation.id === 5104) {
              for (let entityData of displayGroup.entityData) {
                let milliseconds = (new Date(entityData.ts)).getTime();
                let pDepthPoint = [milliseconds, entityData.E[entityInformation.id]];
                pDepthData.push(pDepthPoint);
              }
            } else if (entityInformation.id === 5141) {
              for (let entityData of displayGroup.entityData) {
                let milliseconds = (new Date(entityData.ts)).getTime();
                let lDepthPoint = [milliseconds, entityData.E[entityInformation.id]];
                lrDepthData.push(lDepthPoint);
              }
            } else if (entityInformation.id === 5124) {
              for (let entityData of displayGroup.entityData) {
                let milliseconds = (new Date(entityData.ts)).getTime();
                let pDepthPoint = [milliseconds, entityData.E[entityInformation.id]];
                pDepth_3Data.push(pDepthPoint);
              }
            } else if (entityInformation.id === 5125) {
              for (let entityData of displayGroup.entityData) {
                let milliseconds = (new Date(entityData.ts)).getTime();
                let upDepthPoint = [milliseconds, entityData.E[entityInformation.id]];
                upDepth_1Data.push(upDepthPoint);
              }
            } else if (entityInformation.id === 5201) {
              for (let entityData of displayGroup.entityData) {
                let milliseconds = (new Date(entityData.ts)).getTime();
                let rawVelPoint = [milliseconds, entityData.E[entityInformation.id]];
                rawVelData.push(rawVelPoint);
              }
            } else if (entityInformation.id === 4202) {
              for (let entityData of displayGroup.entityData) {
                let milliseconds = (new Date(entityData.ts)).getTime();
                let velocityPoint = [milliseconds, entityData.E[entityInformation.id]];
                velocityData.push(velocityPoint);
              }
            } else if (entityInformation.id === 3302) {
              for (let entityData of displayGroup.entityData) {
                let milliseconds = (new Date(entityData.ts)).getTime();
                let flowPoint = [milliseconds, entityData.E[entityInformation.id]];
                flowData.push(flowPoint);
              }
            } else if (entityInformation.id === 3307) {
              for (let entityData of displayGroup.entityData) {
                let milliseconds = (new Date(entityData.ts)).getTime();
                let qManningPoint = [milliseconds, entityData.E[entityInformation.id]];
                qManningData.push(qManningPoint);
              }
            } else if (entityInformation.id === 2123) {
              for (let entityData of displayGroup.entityData) {
                let milliseconds = (new Date(entityData.ts)).getTime();
                let rainPoint = [milliseconds, entityData.E[entityInformation.id]];
                rainData.push(rainPoint);
              }
            }

          }
        }
        this.showHydrograph = true;
        this.loading.hydrograph = true;
        this.initChart(depthData, sDepth_3Data, pDepth_1Data, pDepthData, lrDepthData, pDepth_3Data,
          upDepth_1Data, rawVelData, velocityData, flowData, qManningData, rainData);
        this.loading.hydrograph = false;
      } else {
        this.noHydroDataFound = true;
        this.showHydrograph = true;
      }
    }, error => this.handleError(error));
    this.subscriptions.push(subscription);
  }

  handleError(error: any) {
    if (error._body.includes('Unable to load location') || error._body.includes('Invalid location')
      || error._body.includes('Invalid customer')) {
      this.noHydroDataFound = true;
    }
  }

  /**
* Initializes the Sacttergraph.
* @param depthData - Data Array for depth series in sacttergraph.
* @param velocityData - Data Array for velocity series in sacttergraph.
*/
  initScatterChart(depthVelocityData, timeStampData) {
    this.scatterOptions = {
      global: {
        useUTC: false,
      },
      tooltip: {
        hideDelay: 0,
        enabled: true,
        shared: true,
        crosshairs: true,
        xDateFormat: '%m/%d/%Y %H:%M %p',
        headerFormat: '',
        pointFormat: 'UniDepth: <b>{point.x}</b><br/> Velocity: <b>{point.y}</b><br/> '
      },
      legend: {
        enabled: false
      },

      chart: {
        renderTo: 'scatterChartIdAuto',
        type: 'scatter',
        zoomType: 'xy'
      },

      plotOptions: {
        column: { groupPadding: 0, pointPadding: 0, pointWidth: 1, borderWidth: 0, shadow: false },
        line: { lineWidth: 0.5 },
        scatter: {
          marker: {
            radius: 5,
            states: {
              hover: {
                enabled: true,
                lineColor: 'rgb(100,100,100)'
              }
            }
          },
          states: {
            hover: {
              marker: {
                enabled: false
              }
            }
          }
        }
      },
      title: {
        text: ''
      },
      xAxis: {
        title: {
          enabled: true,
          text: this.xAxisLabel
        },
        ordinal: false
      },
      yAxis: {
        title: {
          text: this.yAxisLabel
        }
      },
      scrollbar: {
        enabled: false,
        liveRedraw: false,
      },
      navigator: { enabled: false, margin: 0 },
      series: [
        {
          marker: { radius: 4, symbol: 'diamond' },
          color: 'rgba(119, 152, 191, .5)',
          data: depthVelocityData
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
  * @param flowData - Data Array for flow series in hydrograph.
  * @param rainData - Data Array for rain series in hydrograph.
  */
  initChart(depthData, sDepth_3Data, pDepth_1Data, pDepthData, lrDepthData, pDepth_3Data,
    upDepth_1Data, rawVelData, velocityData, flowData, qManningData, rainData) {
    this.options = {
      global: {
        useUTC: false,
      },
      tooltip: {
        hideDelay: 0,
        enabled: true,
        shared: true,
        crosshairs: true,
        xDateFormat: '%m/%d/%Y %H:%M %p'
      },
      credits: {
        enabled: false
      },
      chart: {
        defaultSeriesType: 'line',
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
        },
        renderTo: 'hydrograph-chart',
        zoomType: 'x'
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
        }
      },
      xAxis: {
        labels: {
          format: '{value: %m/%d/%Y }',
          rotation: 45
        },
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
        tickInterval: 24 * 3600 * 1000,
        type: 'datetime'
      },
      yAxis: {
        labels: {
          enabled: false
        }
      },
      legend: {
        enabled: true,
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
      },
      scrollbar: {
        enabled: false,
        liveRedraw: false,
      },
      navigator: { enabled: false, margin: 0 },
      series: [
        {
          name: 'UniDepth', type: 'line',
          data: depthData,
          showInLegend: depthData.length > 0,
          color: ColorBrewer.Greens[9][6], dataGrouping: { enabled: false }, zIndex: 5, lineWidth: 1.5
        },
        {
          name: 'SDEPTH_3', type: 'line',
          data: sDepth_3Data,
          showInLegend: sDepth_3Data.length > 0,
          color: ColorBrewer.Greens[9][6], dataGrouping: { enabled: false }, zIndex: 5, lineWidth: 1.5
        },
        {
          name: 'PDEPTH_1', type: 'line',
          data: pDepth_1Data,
          showInLegend: pDepth_1Data.length > 0,
          color: ColorBrewer.Greens[9][6], dataGrouping: { enabled: false }, zIndex: 5, lineWidth: 1.5
        },
        {
          name: 'PDEPTH', type: 'line',
          data: pDepthData,
          showInLegend: pDepthData.length > 0,
          color: ColorBrewer.Greens[9][6], dataGrouping: { enabled: false }, zIndex: 5, lineWidth: 1.5
        },
        {
          name: 'LRDEPTH', type: 'line',
          data: lrDepthData,
          showInLegend: lrDepthData.length > 0,
          color: ColorBrewer.Greens[9][6], dataGrouping: { enabled: false }, zIndex: 5, lineWidth: 1.5
        },
        {
          name: 'PDEPTH_3', type: 'line',
          data: pDepth_3Data,
          showInLegend: pDepth_3Data.length > 0,
          color: ColorBrewer.Greens[9][6], dataGrouping: { enabled: false }, zIndex: 5, lineWidth: 1.5
        },
        {
          name: 'UpDEPTH_1', type: 'line',
          data: upDepth_1Data,
          showInLegend: upDepth_1Data.length > 0,
          color: ColorBrewer.Greens[9][6], dataGrouping: { enabled: false }, zIndex: 5, lineWidth: 1.5
        },
        {
          name: 'Raw Velocity', type: 'line',
          data: rawVelData,
          showInLegend: rawVelData.length > 0,
          color: ColorBrewer.Reds[9][6], dataGrouping: { enabled: false }, zIndex: 5, lineWidth: 1.5
        },
        {
          name: 'Vel', type: 'line',
          data: velocityData,
          showInLegend: velocityData.length > 0,
          color: ColorBrewer.Reds[9][6], dataGrouping: { enabled: false }, zIndex: 5, lineWidth: 1.5
        },
        {
          name: 'QContinuity', type: 'line',
          data: flowData,
          showInLegend: flowData.length > 0,
          color: ColorBrewer.Blues[9][6], dataGrouping: { enabled: false }, zIndex: 5, lineWidth: 1.5
        },
        {
          name: 'QManning', type: 'line',
          data: qManningData,
          showInLegend: qManningData.length > 0,
          color: ColorBrewer.Blues[9][6], dataGrouping: { enabled: false }, zIndex: 5, lineWidth: 1.5
        },
        {
          name: 'Rain', type: 'column',
          data: rainData,
          showInLegend: rainData.length > 0,
          color: ColorBrewer.Oranges[9][6], dataGrouping: { enabled: false }, zIndex: 5, lineWidth: 1.5
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

  /**
  * saves the chart instance to a chart variable.
  * @param chart - instance of scatter chart.
  */
  saveScatterChart(chart) {
    this.scatterChart = chart;
  }

  onPointSelect(point) {
  }

  /**
   * It gets called on mouse over of series in Hydrograph.
   * @param point - point of the Hydrograph.
   */
  onSeriesMouseOver(point) {
  }

  onSeriesMouseOverScatter(point) {
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

  loadLocations(customerId: number) {
    this.customerId = customerId;
    this.locationGroupID = this.locationGroupService.locationGroupID;
    // Fetch the locations for selected customer
    let subscription = this.locationDashboardService.getLocations(this.customerId, this.locationGroupID).subscribe(
      res => {
        this.locations = res;
        let filterPipe = new OrderByPipe();
        this.locations = filterPipe.transform(this.locations, 'locationName', false);
        if (this.locations.length > 0) {
          this.locationId = this.locations[0].locationId;
          this.resetLocationId = this.locations[0].locationId;
          this.resetTab();
        }
        if (this.checkGraph === false) {
          this.displayGraph();
          this.checkGraph = true;
        }
      }
    );
    this.subscriptions.push(subscription);
  }

  onLocationGroupChange(locationGroupId: number) {
    this.locationGroupID = this.locationGroupService.locationGroupID;
    if (this.locationGroupID !== null && this.customerId !== undefined) {
      // get the updated location based on locationGroupId
      let subscription = this.locationDashboardService.getLocations(this.customerId, this.locationGroupID).subscribe(
        res => {
          this.locations = res;
          let filterPipe = new OrderByPipe();
          this.locations = filterPipe.transform(this.locations, 'locationName', false);
          if (this.locations.length > 0) {
            this.locationId = this.locations[0].locationId;
            this.resetLocationId = this.locations[0].locationId;
            this.resetTab();
          }
        });
      this.subscriptions.push(subscription);
    }

  }

  onStartDateChanged(event: IMyInputFieldChanged) {
    this.startDateValidity = event.valid;
    this.startDateValue = event.value;
    if (this.startDateValue === '') {
      this.displayStartDateErrMsg = true;
    } else {
      this.displayStartDateErrMsg = false;
    }

    if ((event.valid === false && this.startDateValue !== '') ||
      (this.endDateValue !== undefined && this.startDateValue !== undefined &&
        this.endDateValue.length === 10 && this.startDateValue.length === 10 &&
        (new Date(this.endDateValue)).getTime() < (new Date(event.value)).getTime())) {
      this.invalidStartDate = true;
    } else {
      this.invalidStartDate = false;
    }

    if (this.endDateValidity) {
      this.invalidEndDate = false;
    } else if (this.endDateValue !== undefined && this.endDateValue !== '' && this.endDateValue.length !== 10) {
      this.invalidEndDate = true;
    }
    this.monthDifference(this.startDateValue, this.endDateValue);
  }

  onEndDateChanged(event: IMyInputFieldChanged) {
    this.endDateValidity = event.valid;
    this.endDateValue = event.value;
    if (this.endDateValue === '') {
      this.displayEndDateErrMsg = true;
    } else {
      this.displayEndDateErrMsg = false;
    }

    if ((event.valid === false && this.endDateValue !== '') ||
      (this.endDateValue !== undefined && this.startDateValue !== undefined &&
        this.endDateValue.length === 10 && this.startDateValue.length === 10 &&
        (new Date(event.value)).getTime() < (new Date(this.startDateValue)).getTime())) {
      this.invalidEndDate = true;
    } else {
      this.invalidEndDate = false;
    }
    if (this.startDateValidity) {
      this.invalidStartDate = false;
    } else if (this.startDateValue !== undefined && this.startDateValue !== '' && this.startDateValue.length !== 10) {
      this.invalidStartDate = true;
    }
    this.monthDifference(this.startDateValue, this.endDateValue);
  }

  monthDifference(startDateValue, endDateValue) {
    let startDate = new Date(startDateValue);
    let endDate = new Date(endDateValue);
    let timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
    let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (diffDays > 30 && !(this.invalidStartDate || this.invalidEndDate) && this.startDateValue.length === 10) {
      this.invalidDateRange = true;
    } else {
      this.invalidDateRange = false;
    }
  }

  resetViewData() {
    this.resetTab();
    this.locationId = this.resetLocationId;
    this.entityId = [4122, 4202, 3302, 2123];
    this.startDate = { date: { year: (new Date()).getFullYear(), month: this.getPreviousMonth(), day: this.getDay() } };
    this.endDate = { date: { year: (new Date()).getFullYear(), month: (new Date()).getMonth() + 1, day: (new Date()).getDate() } };
  }

  onSelectChange(tabgroup: MdTabGroup) {
    let pid = tabgroup._tabs.find((e, i, a) => i === tabgroup.selectedIndex)
      .content.viewContainerRef.element.nativeElement.dataset.pid;
    // tslint:disable-next-line:radix
    this.locationId = parseInt(pid);
  }

  onLocationSelected(location: any) {
    this.locationId = location.locationId;
  }

  resetTab() {
    this.selectedTab = -1;
    setTimeout(() => {
      this.selectedTab = 0
    }, 10);
  }

}
