import { Injectable } from '@angular/core';

@Injectable()
export class DateutilService {

  startDate: any = { date: { year: (new Date()).getFullYear(), month: this.getPreviousMonth(), day: this.getDay() } };
  endDate: any = { date: { year: (new Date()).getFullYear(), month: (new Date()).getMonth() + 1, day: (new Date()).getDate() } };

  constructor() { }

  getPreviousMonth() {
    let date = new Date();
    date.setDate(date.getDate() - 1);
    return (date.getMonth() + 1);
  }
  getDay() {
    let date = new Date();
    date.setDate(date.getDate() - 1);
    return date.getDate();
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

   formatEndDatePreviousDay(date) {
    if (date !== null) {
      let dt = date.date;
      if (dt.month.length < 2) {
        dt.month = '0' + dt.month;
      }
      if (dt.day.length < 2) {
        dt.day = '0' + dt.day;
      }
      return dt.month + '/' + dt.day + '/' + dt.year + ' 23:59:59';
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

}
