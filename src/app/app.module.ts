import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing } from './app.routing';
import { ChartModule } from 'angular2-highcharts';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { NavigationModule } from './navigation/navigation.module';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { Angulartics2Module, Angulartics2GoogleAnalytics } from 'angulartics2';
import {
  MaterialModule,
  MdDialogModule,
  MdListModule,
  MdSnackBar
} from '@angular/material';
import { AppConfigOptions } from 'app/app.config.options';
import { AdalService } from 'ng2-adal/services/adal.service';
import { WelcomeComponent } from './public/welcome/welcome.component';
import { SubmissionsComponent } from './pages/submissions/submissions.component';
import { OrderByPipe, RoundPipe, SearchLocationNamePipe } from './shared/pipes/';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
import { MyDatePickerModule } from 'mydatepicker';
import { pagesRouting } from './pages/pages.routing';
import { PagesModule } from './pages/pages.module';

import { QstartModule } from './qstart.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AutoScrubSummaryComponent } from './pages/auto-scrub-summary/auto-scrub-summary.component';
import { LocationDashboardComponent } from './locationdashboard/location-dashboard.component';
import { DatepickerModule } from 'angular2-material-datepicker';
import { BatteryStatusWidgetComponent } from './pages/battery-status-widget/battery-status-widget.component';
import { LocationGroupEditorComponent } from './locationdashboard/location-group-editor/location-group-editor.component';
import { CollectionWidgetComponent } from './pages/collection-widget/collection-widget.component';
import { CollectionWidgetScheduleComponent } from './pages/collection-widget-schedule/collection-widget-schedule.component';
import { AlarmWidgetComponent } from './pages/alarm-widget/alarm-widget.component';
import { AutoReviewWidgetComponent } from 'app/pages/auto-review-widget/auto-review-widget.component';
import { BlockagePredictionWidgetComponent } from 'app/pages/blockage-prediction-widget/blockage-prediction-widget.component';
import { UserPreferencesComponent } from 'app/pages/user-preferences/user-preferences.component';
import { CustomerEditorComponent } from 'app/pages/customer-editor/customer-editor.component';
import { ViewDataComponent } from 'app/pages/view-data/view-data.component';
import { AlarmGraphComponent } from 'app/pages/alarm-graph/alarm-graph.component';
import {
  AddLocationComponent,
  FileUploadDialogComponent,
  MonitorSettingsComponent,
  ContactUsComponent,
  AssistanceCenterComponent
} from './shared/components';
import { ViewDataService } from 'app/shared/services/view-data.service';
import {
  AuthGuard,
  AuthService,
  CrowdCoreService,
  CustomerService,
  DateService,
  HttpClient,
  LocationGroupService,
  LocationService,
  DateutilService,
  LocationDashboardService,
  BatteryStatusService,
  AutoScrubSummaryService,
  ScheduleCollectionService,
  AlarmService,
  BlockagePredictionService,
  SearchService,
  MonitorSettingService
} from './shared/services';
import { SelectModule } from 'ng2-select';


export function highchartsFactory() {
  return require('highcharts/highstock');
}

const defaultOptions: AppConfigOptions = {
  appTitle: 'ADS Core',
  openSidenavStyle: 'side',
  closedSidenavStyle: 'icon overlay'
};
@NgModule({
  declarations: [
    AppComponent,
    SubmissionsComponent,
    WelcomeComponent,
    LocationDashboardComponent,
    BatteryStatusWidgetComponent,
    OrderByPipe,
    RoundPipe,
    AutoScrubSummaryComponent,
    SearchLocationNamePipe,
    LocationGroupEditorComponent,
    CollectionWidgetComponent,
    CollectionWidgetScheduleComponent,
    AlarmWidgetComponent,
    AutoReviewWidgetComponent,
    BlockagePredictionWidgetComponent,
    UserPreferencesComponent,
    AddLocationComponent,
    CustomerEditorComponent,
    ViewDataComponent,
    AlarmGraphComponent,
    MonitorSettingsComponent,
    ContactUsComponent,
    AssistanceCenterComponent
  ],
  imports: [
    CommonModule,
    QstartModule,
    SharedModule.forRoot(),
    NavigationModule.forRoot(),
    BrowserModule,
    FormsModule,
    HttpModule,
    pagesRouting,
    routing,
    PagesModule,
    Angulartics2Module.forRoot([Angulartics2GoogleAnalytics]),
    MaterialModule,
    MdDialogModule,
    MdListModule,
    ChartModule,
    BrowserAnimationsModule,
    DatepickerModule,
    MyDatePickerModule,
    ReactiveFormsModule,
    SelectModule
  ],
  providers: [
    HttpClient,
    DateService,
    MdSnackBar,
    AdalService,
    AuthService,
    AuthGuard,
    CrowdCoreService,
    CustomerService,
    LocationService,
    LocationGroupService,
    DateutilService,
    LocationDashboardService,
    BatteryStatusService,
    AutoScrubSummaryService,
    ScheduleCollectionService,
    AlarmService,
    BlockagePredictionService,
    SearchService,
    ViewDataService,
    { provide: 'AppConfigOptions', useValue: defaultOptions },
    {
      provide: HighchartsStatic,
      useFactory: highchartsFactory
    },
    MonitorSettingService
  ],
  entryComponents: [
    AppComponent,
    LocationGroupEditorComponent,
    CollectionWidgetScheduleComponent,
    UserPreferencesComponent,
    AddLocationComponent,
    CustomerEditorComponent,
    AlarmGraphComponent,
    MonitorSettingsComponent,
    FileUploadDialogComponent,
    ContactUsComponent,
    AssistanceCenterComponent
  ],
  bootstrap: [AppComponent],
  exports: [
    CommonModule
  ]
})
export class AppModule {

}
