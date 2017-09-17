import { Http } from '@angular/http';
import { Component, OnInit, Input, Output, Pipe, EventEmitter } from '@angular/core';
import { QstartDataService } from './services/qstart.service';

@Component ({
    selector: 'qstart-modem-power',
    templateUrl: './qstart-modem-power.html',
    providers: [QstartDataService]
})

export class QstartModemPowerComponent {
    @Input() selectedLocation;
    @Input() isConnecting;
    @Output() outputEvent:EventEmitter<Boolean>=new EventEmitter();
    //powerSettingReceived: Object
    isDisplayPowerModem: Boolean;
    timeSetting: Object;
    timeSettings: Array <any>;
    timesArray: Array <any>;
    validInputArray: Array<any>;
    validInput: Boolean;
    modemPowerConfig: Object;


    constructor(private qstartDataService: QstartDataService) {
        this.isDisplayPowerModem = false;
    }

    ngOnInit() {
       
        this.timesArray = [];

        for (var i = 0; i < 25; i++) {
            this.timesArray.push(i);
        }  
    }

    displayModemPower() {
        this.isDisplayPowerModem = !this.isDisplayPowerModem;
        if (this.isDisplayPowerModem) {
            this.getModemPowerConfig(this.selectedLocation['id']);
        }
    }

    getModemPowerConfig(id) {
            this.isConnecting = true;
            this.outputEvent.emit(this.isConnecting);

            this.qstartDataService.getModemPowerConfig(55)
                .subscribe(
                result => {
                    this.modemPowerConfig = result;

                    /****/
                    this.timeSettings = [];

                    if (this.modemPowerConfig['days'].length > 0) {

                        this.modemPowerConfig['days'].forEach((day, dayIndex) => {
                            if (this.timeSettings.length == 0) {
                                this.timeSettings.push ({ spanStart: day.spanStart, spanEnd: day.spanEnd, days: [] });
                            }
                            var exists = false;

                            this.timeSettings.forEach((existDay, existDayIndex) => {
                                if (existDay.spanStart == day.spanStart && existDay.spanEnd == day.spanEnd) {
                                    exists = true;
                                } 
                            });

                            if (!exists) {
                                this.timeSettings.push({ spanStart: day.spanStart, spanEnd: day.spanEnd, days: [] });
                            }
                        });

                        this.timeSettings.forEach((existDay, existDayIndex) => {
                            this.modemPowerConfig['days'].forEach((day, dayIndex) => {
                                var tempDay = { id: dayIndex, selected: false };
                                switch (dayIndex) {
                                    case 0: 
                                        tempDay['abrv'] = "S";
                                        break;
                                    case 1: 
                                        tempDay['abrv'] = "M";
                                        break;
                                    case 2: 
                                        tempDay['abrv'] = "T";
                                        break;
                                    case 3: 
                                        tempDay['abrv'] = "W";
                                        break;
                                    case 4: 
                                        tempDay['abrv'] = "Th";
                                        break;
                                    case 5: 
                                        tempDay['abrv'] = "F";
                                    case 6: 
                                        tempDay['abrv'] = "S";
                                }
                                if (existDay.spanStart == day.spanStart && existDay.spanEnd == day.spanEnd) {
                                    tempDay.selected = true;
                                } 
                                existDay.days.push(tempDay);
                            });
                        });

                    }
                    this.validInput = true;
    
                    /*****/

                    this.qstartDataService.disconnectMonitor(55)
                        .subscribe(
                        result => {
                            this.isConnecting = false;
                            this.outputEvent.emit(this.isConnecting);
                        },
                        err => {
                            this.isConnecting = false;
                            this.outputEvent.emit(this.isConnecting);
                        });
                },
                err => {
                    console.log("Error: " + err);
                    this.isConnecting = false;
                    this.outputEvent.emit(this.isConnecting);
                });
    }

    addPowerSetting() {
        if (this.timeSettings.length < 7) {
            var newTimeSetting = {
                spanStart: 0,
                spanEnd: 0,
                days: [
                    { id:0, abrv: 'S', selected: false },
                    { id:1, abrv: 'M', selected: false },
                    { id:2, abrv: 'T', selected: false },
                    { id:3, abrv: 'W', selected: false },
                    { id:4, abrv: 'Th', selected: false },
                    { id:5, abrv: 'F', selected: false },
                    { id:6, abrv: 'S', selected: false }
                ]
            }

            this.timeSettings.push(newTimeSetting);
        }
    }

    removePowerSetting(i) {
        if (this.timeSettings.length > 0) {
            this.timeSettings.splice(i, 1);
        }

        this.checkFormValidity()
    }

    selectTime(settingIndex, timeSelected) {
        if (timeSelected.selected) {

            this.timeSettings.forEach((item, itemIndex) => {
                    if (itemIndex !== settingIndex) {
                        item.days.forEach(day => {
                            if(day.id === timeSelected.id) {
                                day.selected = false;
                            }
                        });
                    }
            });
        }  
        this.checkFormValidity();
    }

    checkFormValidity() {
        if (this.timeSettings.length > 0) {
            var i = 0;
            this.validInput = false;
            var counter = 0;

            while (i < this.timeSettings[0].days.length) {
                this.timeSettings.forEach(setting => {
                        if (setting.days[i].selected) {
                            counter++;
                        }
                });
                i++;
            }

            if (counter == this.timeSettings[0].days.length) {
                this.validInput = true;
            }
        }
    }

    submitModemPowerSettings() {

    }

}

/*
import { Http } from '@angular/http';
import { Component, OnInit, Input, Output, Pipe, EventEmitter } from '@angular/core';
import { QstartDataService } from './services/qstart.service';

@Component ({
    selector: 'qstart-modem-power',
    templateUrl: './qstart-modem-power.html',
    providers: [QstartDataService]
})

export class QstartModemPower {
    @Input() selectedLocation;
    @Input() isConnecting;
    @Output() outputEvent:EventEmitter<Boolean>=new EventEmitter();
    showPowerSaving: Boolean;
    timeSetting: Object;
    timeSettings: Array <any>;
    timesArray: Array <any>;
    validInputArray: Array<any>;
    validInput: Boolean;
    modemPowerConfig: Object;


    constructor(private qstartDataService: QstartDataService) {
        this.showPowerSaving = false; 
    }

    ngOnInit() {
        this.timeSetting = {
            start: '8:30 AM',
            end: '5:30 PM',
            days: [
                { name: 'Sunday', abrv: 'S', selected: true },
                { name: 'Monday', abrv: 'M', selected: true },
                { name: 'Tuesday', abrv: 'T', selected: true },
                { name: 'Wednesday', abrv: 'W', selected: true },
                { name: 'Thursday', abrv: 'Th', selected: true },
                { name: 'Friday', abrv: 'F', selected: true },
                { name: 'Saturday', abrv: 'S', selected: true}
            ]
        }

        this.validInput = true;

        this.timesArray = [
            '8:30 AM', '9:00 AM', '9:30 AM', '5:00 PM', '5:30 PM'
        ];
        this.timeSettings = [];
        this.timeSettings.push(this.timeSetting);

        if (this.showPowerSaving) {
            this.getModemPowerConfig(this.selectedLocation);
        }
    }

    getModemPowerConfig(location) {
        if (this.showPowerSaving) {
            this.isConnecting = true;
            this.outputEvent.emit(this.isConnecting);

            this.qstartDataService.getModemPowerConfig(55)
                .subscribe(
                result => {
                    location.isConnected = !location.isConnected;
                    this.modemPowerConfig = result;

                    this.qstartDataService.disconnectMonitor(55)
                        .subscribe(
                        result => {
                            this.isConnecting = false;
                            this.outputEvent.emit(this.isConnecting);
                            location.isConnected = false;
                        },
                        err => {
                            this.isConnecting = false;
                            this.outputEvent.emit(this.isConnecting);
                            location.isConnected = false;
                        });
                },
                err => {
                    console.log("Error: " + err);
                    this.isConnecting = false;
                     this.outputEvent.emit(this.isConnecting);
                });
        }

    }

    addPowerSetting() {
        if (this.timeSettings.length < 7) {
            var newTimeSetting = {
                start: '8:30 AM',
                end: '5:30 PM',
                days: [
                    { name: 'Sunday', abrv: 'S', selected: false },
                    { name: 'Monday', abrv: 'M', selected: false },
                    { name: 'Tuesday', abrv: 'T', selected: false },
                    { name: 'Wednesday', abrv: 'W', selected: false },
                    { name: 'Thursday', abrv: 'Th', selected: false },
                    { name: 'Friday', abrv: 'F', selected: false },
                    { name: 'Saturday', abrv: 'S', selected: false }
                ]
            }

            this.timeSettings.push(newTimeSetting);
        }
    }

    removePowerSetting(i) {
        if (this.timeSettings.length > 0) {
            this.timeSettings.splice(i, 1);
        }

        this.checkFormValidity()
    }

    selectTime(settingIndex, timeSelected) {
        if (timeSelected.selected) {

            this.timeSettings.forEach((item, itemIndex) => {
                    if (itemIndex !== settingIndex) {
                        item.days.forEach(day => {
                            if(day.name === timeSelected.name) {
                                day.selected = false;
                            }
                        });
                    }
            });
        }  
        this.checkFormValidity();
    }

    checkFormValidity() {
        if (this.timeSettings.length > 0) {
            var i = 0;
            this.validInput = false;
            var counter = 0;

            while (i < this.timeSettings[0].days.length) {
                this.timeSettings.forEach(setting => {
                        if (setting.days[i].selected) {
                            counter++;
                        }
                });
                i++;
            }

            if (counter == this.timeSettings[0].days.length) {
                this.validInput = true;
            }
        }
    }

}
*/