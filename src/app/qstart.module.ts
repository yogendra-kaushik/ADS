import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing } from './app.routing';

import { SharedModule } from './shared/shared.module';
import { NavigationModule } from './navigation/navigation.module';
import { HttpClient } from './shared/services/http-client';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { Angulartics2Module, Angulartics2GoogleAnalytics } from 'angulartics2';
import { AppConfigOptions } from 'app/app.config.options';
import { MaterialModule, MdSnackBar } from '@angular/material';
import { AdalService } from 'ng2-adal/services/adal.service';
import { AuthService } from './shared/services/auth.service';
import { AuthGuard } from './shared/services/auth-guard.service';


import { QstartComponent } from './pages/qstart/qstart.component';
import { QstartMonitorComponent } from './pages/qstart/qstart-monitor.component';
import { QstartMonitorConfigurationComponent } from './pages/qstart/qstart-monitor-configuration.component';
import { QstartModbusComponent } from './pages/qstart/qstart-modbus.component';
import { QstartModemPowerComponent } from './pages/qstart/qstart-modem-power.component';
import { QstartNewMonitorComponent } from './pages/qstart/qstart-new-monitor.component';
import { QstartMonitorPointComponent } from './pages/qstart/qstart-monitor-point.component';
import { QstartMonitorDataComponent } from './pages/qstart/qstart-monitor-data.component';


@NgModule({
  declarations: [
    QstartComponent,
    QstartModemPowerComponent,
    QstartMonitorComponent,
    QstartMonitorConfigurationComponent,
    QstartModbusComponent,
    QstartNewMonitorComponent,
    QstartMonitorPointComponent,
    QstartMonitorDataComponent
  ],
  imports: [
    SharedModule.forRoot(),
    NavigationModule.forRoot(),
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    Angulartics2Module.forRoot([Angulartics2GoogleAnalytics]),
    MaterialModule
  ],
  providers: [HttpClient, MdSnackBar, AdalService, AuthService, AuthGuard],
  entryComponents: [QstartModbusComponent],
  bootstrap: []
})
export class QstartModule {

}
