import { Component, OnInit } from '@angular/core';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'confirm-dialog',
    template: '<div><h4>{{title}}</h4><p>{{message}}</p></div>'
})


export class ConfirmDialog {
    title: string;
    message: string;

    constructor(public dialogRef: MdDialogRef<ConfirmDialog>) { }
}