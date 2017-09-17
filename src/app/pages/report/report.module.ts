import { NgModule } from '@angular/core';
import { MaterialModule } from '@angular/material';
import { MyDatePickerModule } from 'mydatepicker';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import {
  DailySummaryDetailsComponent,
  DailySummaryOverviewComponent,
} from './daily-summary-report';
import { LocationGroupService } from 'app/shared/services';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    MyDatePickerModule,
    ReportRoutingModule,
    MaterialModule,
    SharedModule
  ],
  declarations: [
    DailySummaryOverviewComponent,
    DailySummaryDetailsComponent
  ],
  providers: [
    LocationGroupService
  ]
})
export class ReportModule { }
