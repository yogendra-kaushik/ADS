import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomerService } from 'app/shared/services/customer.service'
import { AutoScrubSummaryService } from 'app/shared/services/auto-scrub-summary.service';
import { Customer } from 'app/shared/models/customer';
import { LocationDetails } from 'app/shared/models/location-details';
import { LocationDashboardService } from '../../shared/services/location-dashboard.service';
import { Locations } from 'app/shared/models/locations';
import { AutoScrubSummary } from 'app/shared/models/auto-scrub-summary';
import { ColorBrewer } from 'app/shared/services/color.brewer';
import { AutoScrubDetails } from 'app/shared/models/auto-scrub-details';
import { OrderByPipe } from 'app/shared/pipes/order-by-pipe';

import { IMyOptions, IMyDateModel, IMyInputFieldChanged, IMyDate } from 'mydatepicker';
import * as Highcharts from 'Highcharts';
import { Global } from 'app/shared/services/global';

@Component({
  selector: 'app-auto-scrub-summary',
  templateUrl: './auto-scrub-summary.component.html',
  styleUrls: ['./auto-scrub-summary.component.scss'],
  providers: [CustomerService, AutoScrubSummaryService, LocationDashboardService, OrderByPipe]
})
export class AutoScrubSummaryComponent implements OnInit {
  endDateValue: string;
  startDateValue: string;
  invalidStartDate: boolean;
  customerId: number;
  locationId: number;
  noDataFound: boolean;
  noHydroDataFound: boolean;
  selectedCustomer: any;
  selectedLocation: any;
  selectedCustomerName: string;
  selectedLocationName: string;
  customers: Customer[] = [];
  locationDetails: LocationDetails = new LocationDetails();
  locations: Locations;
  autoScrubSummaryDetails: AutoScrubSummary[];
  autoScrubDetails: AutoScrubDetails[];
  startDate: any = { date: { year: (new Date()).getFullYear(), month: this.getPreviousMonth(), day: this.getDay() } };
  endDate: any = { date: { year: (new Date()).getFullYear(), month: (new Date()).getMonth() + 1, day: (new Date()).getDate() } };
  errThresholds: any;
  selectedThreshold: any;
  displayAutoScrubSummary: boolean;
  showHydrograph: boolean;
  options: any;
  chart: any;
  displayStartDateErrMsg: boolean;
  displayEndDateErrMsg: boolean;
  invalidDateRange: boolean;

  public myDatePickerOptions: IMyOptions = {
    dateFormat: 'mm/dd/yyyy',
    disableSince: <IMyDate>{ year: (new Date()).getFullYear(), month: (new Date()).getMonth() + 1, day: (new Date()).getDate() + 1 },
  };


  loading = {
    hydrograph: false,
    autoScrub: false
  };

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

  constructor(private customerService: CustomerService,
    private autoScrubSummaryService: AutoScrubSummaryService,
    private locationDashboardService: LocationDashboardService,
    private orderByPipe: OrderByPipe) {
  }

  ngOnInit() {
    this.errThresholds = [
      { value: '3', text: '3%' },
      { value: '5', text: '5%' },
      { value: '10', text: '10%' }
    ]
    this.selectedThreshold = this.errThresholds[1].value;
    this.customerService.getCustomers().subscribe(res => {
      this.customers = res;
      this.selectedCustomer = this.customers[0];
      this.locationDashboardService.getLocations(this.selectedCustomer.customerID).subscribe(
        result => {
          this.locations = result;
          this.selectedLocation = 0;
          this.getAutoScrubSummaryDetails();
        }
      );
    });
  }

  onStartDateChanged(event: IMyInputFieldChanged) {
    this.startDateValue = event.value;
    if (event.value === '') {
      this.displayStartDateErrMsg = true;
    } else {
      this.displayStartDateErrMsg = false;
    }

    if ((new Date(this.endDateValue)).getTime() < (new Date(event.value)).getTime()) {
      this.invalidStartDate = true;
    } else {
      this.invalidStartDate = false;
    }
    this.monthDifference(this.startDateValue, this.endDateValue);
  }

  onEndDateChanged(event: IMyInputFieldChanged) {
    this.endDateValue = event.value;
    if (event.value === '') {
      this.displayEndDateErrMsg = true;
    } else {
      this.displayEndDateErrMsg = false;
    }

    if ((new Date(event.value)).getTime() < (new Date(this.startDateValue)).getTime()) {
      this.invalidStartDate = true;
    } else {
      this.invalidStartDate = false;
    }
    this.monthDifference(this.startDateValue, this.endDateValue);
  }

  monthDifference(startDateValue, endDateValue) {
    let startDate = new Date(startDateValue);
    let endDate = new Date(endDateValue);
    let timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
    let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (diffDays > 30 && !(this.invalidStartDate) && this.startDateValue.length === 10) {
      this.invalidDateRange = true;
    } else {
      this.invalidDateRange = false;
    }
  }

  getLocations() {
    this.locationDashboardService.getLocations(this.selectedCustomer.customerID).subscribe(
      result => {
        this.locations = result;
        // this.selectedLocation = this.locations[0];
        this.selectedLocation = 0;
      }
    );
  }

  onCustomerChange(selectedCustomer: any) {
    this.selectedCustomer.customerId = selectedCustomer.customerID;
    this.selectedCustomer.customerName = selectedCustomer.customerName;
    this.getLocations();
  }

  onChangeLocation(selectedLocation: any) {
    this.selectedLocation.locationId = selectedLocation.locationId;
    this.selectedLocation.locationName = selectedLocation.locationName;
  }

  formatStartDate(date) {
    if (date !== null) {
      let dt = date.date;
      if (dt.month.length < 2) {
        dt.month = '0' + dt.month;
      }
      if (dt.day.length < 2) {
        dt.day = '0' + dt.day;
      }
      return dt.month + '/' + dt.day + '/' + dt.year + ' 00:00:00';
    }

  }

  formatEndDate(date) {
    if (date !== null) {
      let dt = date.date;
      if (dt.month.length < 2) {
        dt.month = '0' + dt.month;
      }
      if (dt.day.length < 2) {
        dt.day = '0' + dt.day;
      }
      if ((new Date()).getDate() === dt.day && (new Date()).getMonth() + 1 === dt.month && (new Date()).getFullYear() === dt.year) {
        let hour = ((new Date()).getHours() < 10 ? '0' : '') + (new Date()).getHours();
        let min = ((new Date()).getMinutes() < 10 ? '0' : '') + (new Date()).getMinutes();
        let sec = ((new Date()).getSeconds() < 10 ? '0' : '') + (new Date()).getSeconds();
        return dt.month + '/' + dt.day + '/' + dt.year + ' ' + hour + ':' + min + ':' + sec;
      } else {
        return dt.month + '/' + dt.day + '/' + dt.year + ' 23:59:59';
      }
    }
  }

  getAutoScrubSummaryDetails() {
    this.loading.autoScrub = true;
    this.displayAutoScrubSummary = true;
    if (this.selectedLocation.locationId === undefined) {
      this.locationId = 0;
    }
    // tslint:disable-next-line:max-line-length
    this.autoScrubSummaryService.getAutoScrubSummary(this.selectedLocation.locationId, this.selectedCustomer.customerID, this.formatStartDate(this.startDate), this.formatEndDate(this.endDate), this.selectedThreshold).subscribe(res => {
      this.selectedCustomerName = this.selectedCustomer.customerName;
      this.selectedLocationName = this.selectedLocation.locationName;
      this.autoScrubSummaryDetails = res;
      if (this.autoScrubSummaryDetails.length === 0) {
        this.noDataFound = true;
      } else {
        this.noDataFound = false;
      }

      for (let autoScrubSummaryDetail of this.autoScrubSummaryDetails) {
        if (autoScrubSummaryDetail.status === 'ANOMALY') {
          autoScrubSummaryDetail.displayStatus = 'Review Required';
        } else {
          if (autoScrubSummaryDetail.status === 'OKAY') {
            autoScrubSummaryDetail.displayStatus = 'GOOD';
          }
        }
      }


      this.autoScrubSummaryDetails.sort((a: any, b: any) => {
        if (a.status < b.status) {
          return -1;
        } else if (a.status > b.status) {
          return 1;
        } else {
          if (a.aDate < b.aDate) {
            return -1;
          } else if (a.aDate > b.aDate) {
            return 1;
          } else {
            return 0;
          }
        }
      });

      this.loading.autoScrub = false;
    });
  }

  displayHydrograph(locationId, locationName, event) {
    this.showHydrograph = false;
    const currentTargetPosition = event.currentTarget.parentElement.offsetTop;
    const graphLocation = currentTargetPosition + document.getElementById('autoScrubSummaryTbl').offsetTop + 64;
    let graphPosition = (document.getElementById('autoScrubSummaryTbl').offsetHeight + 200) - 500;
    if (graphPosition < 100) {
      graphPosition = 200;
    } else if (graphLocation < graphPosition) {
      graphPosition = graphLocation;
    }
    // console.log('currentTargetPosition UI  :' + currentTargetPosition);
    let elem = document.getElementById('autoScrubDetailGrph');
    elem.style.top = graphPosition + 'px';
    document.getElementsByClassName('mat-sidenav-content')[0].scrollTop = graphPosition - 200;
    /* *end* */
    this.selectedLocationName = locationName;
    // console.log('locationId UI  :' + locationId);
    this.loading.autoScrub = true;
    // tslint:disable-next-line:max-line-length
    this.autoScrubSummaryService.getAutoScrubDetails(locationId, this.selectedCustomer.customerID, this.formatStartDate(this.startDate), this.formatEndDate(this.endDate)).subscribe(res => {
      this.autoScrubDetails = res;

      if (this.autoScrubDetails.length === 0) {
        this.noHydroDataFound = true;
      } else {
        this.noHydroDataFound = false;
      }

      let depthData = [];
      let velocityData = [];

      $.each(this.autoScrubDetails, function (i, fdp) {
        let milliseconds = (new Date(fdp.ts)).getTime();

        let depthPoint = [milliseconds, fdp.E.U];
        let velocityPoint = [milliseconds, fdp.E.V];

        depthData.push(depthPoint);
        velocityData.push(velocityPoint);
      });

      this.showHydrograph = true;
      this.loading.hydrograph = true;
      // this.chartService.clearChartData();
      this.initChart(depthData, velocityData);

      this.loading.hydrograph = false;
      this.loading.autoScrub = false;
    });
  }

  /**
   * Initializes the Hydrograph.
   * @param depthData - Data Array for depth series in hydrograph.
   * @param velocityData - Data Array for velocity series in hydrograph.
   */
  initChart(depthData, velocityData) {
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
    // this.chartService.chartHyd = chart;
  }

  onPointSelect(point) {
    // this.chartService.moveSelectionWormPlotBands(point.index);
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
        // this.chartService.moveCursorWormPlotBands(point.index);

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

  closeAutoScrubDetailPopUp() {
    this.showHydrograph = false;
  }
}
