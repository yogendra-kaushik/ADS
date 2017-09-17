import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {

  constructor(public dialogRef: MdDialogRef<ContactUsComponent>) { }

  ngOnInit() {
  }
  public emitContactUs() {
    this.dialogRef.close({ success: false });
  }
}
