
import { Component, Output, Input, EventEmitter } from '@angular/core';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ClusterLocationsComponent } from './cluster-locations.component';
import { MdSnackBar } from '@angular/material';
import { MaterialModule, MdDialog } from '@angular/material';
import { SharedModule } from 'app/shared/shared.module';
import { CollectService } from 'app/shared/services/collect.service';
import { HttpClient } from 'app/shared/services/http-client';
import { AuthService } from 'app/shared/services/auth.service';
import { AdalService } from 'ng2-adal/services/adal.service';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions, Http } from '@angular/http';


describe('ClusterLocationsComponent', () => {
  let component: ClusterLocationsComponent;
  let fixture: ComponentFixture<ClusterLocationsComponent>;
  let collectService: CollectService;
  let mdDialog: MdDialog;
  let mdSnackBar: MdSnackBar;
  beforeEach(async(() => {
    component = new ClusterLocationsComponent(collectService, mdDialog, mdSnackBar);
    TestBed.configureTestingModule({
      declarations: [ClusterLocationsComponent],
      imports: [MaterialModule],
      providers: [MdSnackBar, CollectService, MdDialog, HttpClient, AuthService, AdalService,
        MockBackend, BaseRequestOptions,
        {
          provide: Http, HttpClient,
          useFactory: (mockBackend, options) => {
            return new Http(mockBackend, options);
          },
          deps: [MockBackend, BaseRequestOptions]
        }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ClusterLocationsComponent);
    fixture.detectChanges();
  }));

  it('validate emitCloseMapLocationsPopup', function (done) {
    component.closeMapLocationsPopup.subscribe(x => {
      expect(x).toBe(true);
      done();
    });
    component.emitCloseMapLocationsPopup();
  });

  it('validate emitOpenLocationDetailsPopUp', function (done) {
    component.openLocationDetailsPopUp.subscribe(x => {
      expect(x).toBe(null);
      done();
    });
    component.emitOpenLocationDetailsPopUp(null);
  });
});
