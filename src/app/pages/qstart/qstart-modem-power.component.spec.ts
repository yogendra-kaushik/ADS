import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { By, BrowserModule } from '@angular/platform-browser';
import { HttpClient } from 'app/shared/services/http-client';
import { QstartModemPowerComponent } from './qstart-modem-power.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { QstartDataService } from './services/qstart.service';
import { AuthService } from 'app/shared/services/auth.service';
import { AdalService } from 'ng2-adal/services/adal.service';
import { ResponseOptions, Http, BaseRequestOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';


describe('QstartModemPower', () => {
  let component: QstartModemPowerComponent;
  let qstartDataService: QstartDataService;
  let fixture: ComponentFixture<QstartModemPowerComponent>;

  beforeEach(async(() => {

    component = new QstartModemPowerComponent(qstartDataService);
    qstartDataService = new QstartDataService(null);

    TestBed.configureTestingModule({
      declarations: [QstartModemPowerComponent],
      imports: [BrowserModule, FormsModule, MaterialModule],
      providers: [QstartDataService, HttpClient, AuthService, AdalService, MockBackend, BaseRequestOptions,
        {
          provide: Http, HttpClient,
          useFactory: (MockBackend, options) => {
            return new Http(MockBackend, options);
          },
          deps: [MockBackend, BaseRequestOptions]
        }]
    })
      .compileComponents();

    fixture = TestBed.createComponent(QstartModemPowerComponent);
    fixture.detectChanges();
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

});