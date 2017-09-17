import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'c-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {
  title: string;
  message: string;
  cancelText: string;
  okText: string;
  id: number;

  constructor(
    @Inject(MD_DIALOG_DATA) private data: any,
    public dialogRef: MdDialogRef<ConfirmationDialogComponent>
  ) {
    this.title = data.title;
    this.message = data.message;
    this.cancelText = data.cancelText;
    this.okText = data.okText;
  }

  ngOnInit() {
  }

  cancelAndClose() {
    this.dialogRef.close({ whichButtorPressed: 'cancel' });
  }

  okAndClose() {
    this.dialogRef.close({ whichButtorPressed: 'ok' });
  }
}
