import { Component, OnInit, Inject } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { AssistanceCenter } from 'app/shared/models';

@Component({
  selector: 'app-assistance-center',
  templateUrl: './assistance-center.component.html',
  styleUrls: ['./assistance-center.component.scss']
})
export class AssistanceCenterComponent implements OnInit {
  public selectedTab: string;
  public selectedTabTitel: string;
  public requestACallPage: boolean;

  constructor(public dialogRef: MdDialogRef<AssistanceCenterComponent>,
    @Inject(MD_DIALOG_DATA) private data: AssistanceCenter) { }


  ngOnInit() {
    this.selectedTab = this.data.selectedTab;
    this.selectedTabTitel = this.data.selectedTabName;
  }
  public emitAssistanceCenter() {
    this.dialogRef.close({ success: false });
  }

  public onChange(event: any, input: any) {
    let files = new Array().slice.call(event.target.files);
    input.value = files.map(f => f.name).join(', ');
  }
  public requestCall() {
    this.requestACallPage = true;
  }
  public emitRequestCall() {
    this.requestACallPage = false;
  }
}
