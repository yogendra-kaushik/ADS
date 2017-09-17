import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../../shared/services/auth-guard.service';

import {
  DailySummaryDetailsComponent,
  DailySummaryDetailsResolverService,
  DailySummaryOverviewComponent,
  DailySummaryOverviewResolver,
  DailySummaryReportService,
} from './daily-summary-report';

export const routes: Routes = [
  {
    path: 'report',
    children: [
      { path: '', redirectTo: 'daily-summary', pathMatch: 'full' },
      {
        path: 'daily-summary',
        canActivate: [AuthGuard],
        children: [
          { path: '', redirectTo: 'overview', pathMatch: 'full' },
          {
            path: 'overview',
            component: DailySummaryOverviewComponent,
            resolve: { 'daily-summary-overview': DailySummaryOverviewResolver }
          },
          {
            path: ':id/details',
            component: DailySummaryDetailsComponent,
            resolve: { 'daily-summary-details': DailySummaryDetailsResolverService }
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    DailySummaryReportService,
    DailySummaryOverviewResolver,
    DailySummaryDetailsResolverService
  ]
})
export class ReportRoutingModule { }
