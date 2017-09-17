import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-user-preferences',
  templateUrl: './user-preferences.component.html',
  styleUrls: ['./user-preferences.component.scss']
})
export class UserPreferencesComponent implements OnInit {
    user: any;

  constructor(public dialogRef: MdDialogRef<UserPreferencesComponent>) { }

  ngOnInit() {

  }
  emitUserPreferences() {
    this.dialogRef.close({ success: false });
  }
}
