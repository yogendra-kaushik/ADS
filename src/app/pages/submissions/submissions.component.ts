import { Component, OnInit, Input } from '@angular/core';

import { CrowdCoreService } from '../../shared/services/crowd-core';

@Component({
  selector: 'ads-submissions',
  templateUrl: './submissions.component.html',
  styleUrls: ['./submissions.component.scss']
})
export class SubmissionsComponent implements OnInit {
  options: Object;
  submissions: any[] = [];
  chart: any;
  dateRanges = [
    { id: 1, name: 'Last 7 days', startDate: this.fromToday(-7), endDate: this.fromToday(0) },
    { id: 2, name: 'Last 1 month', startDate: this.fromToday(-30), endDate: this.fromToday(0) }
  ];
  dateRangeId = 1;

  constructor(private crowdCoreService: CrowdCoreService) {
  }

  ngOnInit() {
    this.options = {
      title: { text: 'Everyday Submissions' },
      chart: { type: 'column' },
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: { // don't display the dummy year
          month: '%e %b',
          year: '%b'
        },
        title: {
          text: 'Date'
        }
      },
      series: [{
        name: 'Submissions'
      }]
    };
    let start = new Date();
    start.setDate(start.getDate() - 7);
    let end = new Date();
    this.loadData(start, end);
  }

  loadData(start: Date, end: Date) {
    this.crowdCoreService.getSubmissions(start, end).subscribe(res => {
      // console.log(res);
      let obj = res.totalSubmissions;
      this.submissions = [];
      for (let prop in obj) {
        if (obj.hasOwnProperty(prop)) {
          this.submissions.push([this.parseDate(prop), obj[prop]]);
        }
      }
      this.submissions = this.submissions.sort((a, b) => a[0] > b[0] ? 1 : -1);
      // console.log(this.submissions);
      this.chart.series[0].setData(this.submissions);
      this.chart.redraw();
    });
  }

  onDateRangeChange() {
    let range = this.dateRanges.find(x => x.id === this.dateRangeId);
    // console.log(range);
    this.loadData(range.startDate, range.endDate);
  }

  saveChart(chart) {
    this.chart = chart;
    this.chart.redraw();
  }

  parseDate(dateString: string) {
    let parts = <any[]>(dateString.split('/'));
    return Date.UTC(parts[0], parts[1] - 1, parts[2]);
    // return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  fromToday(numberOfDays: number) {
    let date = new Date();
    date.setDate(date.getDate() + numberOfDays);
    return date;
  }
}
