import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { By, BrowserModule } from '@angular/platform-browser';
import { HttpClient } from 'app/shared/services/http-client';
import { QstartMonitorConfigurationComponent } from './qstart-monitor-configuration.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { QstartDataService } from './services/qstart.service';
import { AuthService } from 'app/shared/services/auth.service';
import { AdalService } from 'ng2-adal/services/adal.service';
import { ResponseOptions, Http, BaseRequestOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { MdDialog } from '@angular/material';


describe('QstartMonitorConfigurationComponent', () => {
    let component:  QstartMonitorConfigurationComponent;
    let qstartDataService: QstartDataService;
    let fixture:    ComponentFixture<QstartMonitorConfigurationComponent>;
    let dialog: MdDialog;

  beforeEach(async(() => {

    qstartDataService = new QstartDataService (null);
    component = new QstartMonitorConfigurationComponent(dialog, qstartDataService);

    TestBed.configureTestingModule({
      declarations: [QstartMonitorConfigurationComponent],
      imports: [BrowserModule, FormsModule, MaterialModule],
      providers: [ QstartDataService,HttpClient, AuthService, AdalService, MockBackend, BaseRequestOptions,
      { provide: Http, HttpClient }]
    })
      .compileComponents();

    fixture = TestBed.createComponent(QstartMonitorConfigurationComponent);
    fixture.detectChanges();
  }));

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

});