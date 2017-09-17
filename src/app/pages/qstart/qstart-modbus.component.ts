import { Component, OnInit } from '@angular/core';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { NgForm } from '@angular/forms';

@Component ({
    selector: 'qstart-modbus',
    templateUrl: './qstart-modbus.html'
})

export class QstartModbusComponent  {
    monitor: Object;
    tempHolder: Object;
    constructor(public dialogRef: MdDialogRef<QstartModbusComponent>) { }

    ngOnInit() {
        this.tempHolder = Object.assign({}, this.monitor);
    }

    confirmModbusSettings() {
        this.dialogRef.close();
    }

    closeDialog() {
        this.monitor = Object.assign({}, this.tempHolder);
        this.dialogRef.close();
    }
}