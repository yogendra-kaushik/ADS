import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MdButtonToggleModule,
  MdListModule,
  MdIconModule,
  MdSidenavModule,
  MaterialModule
} from '@angular/material';

import { FileUploadModule } from 'ng2-file-upload'

import { FileExtensionPipe } from 'app/shared/pipes';
import { pagesRouting } from './pages.routing';
import { ReportModule, ReportRoutingModule } from './report';
import {
  VaultDashboardComponent,
  VaultDashboardResolverService,
  VaultItemComponent,
  VaultItemShareComponent,
  VaultNavComponent,
  VaultNavItemComponent,
  VaultService,
  VaultTelemetryImportComponent
} from './vault';
import { FileUploadDialogComponent } from 'app/shared/components';
import { SharedModule } from 'app/shared/shared.module';

export function highchartsFactory() {
  return require('highcharts/highstock');
}

@NgModule({
  imports: [
    CommonModule,
    FileUploadModule,
    MaterialModule,
    MdButtonToggleModule,
    MdIconModule,
    MdListModule,
    MdSidenavModule,
    ReportModule,
    ReportRoutingModule,
    SharedModule,
    pagesRouting,
  ],
  declarations: [
    FileExtensionPipe,
    FileUploadDialogComponent,
    VaultDashboardComponent,
    VaultNavComponent,
    VaultNavItemComponent,
    VaultItemComponent,
    VaultItemShareComponent,
    VaultTelemetryImportComponent
  ],
  entryComponents: [
    VaultItemShareComponent,
    VaultTelemetryImportComponent
  ],
  providers: [
    VaultService,
    VaultDashboardResolverService
  ]
})
export class PagesModule {}
