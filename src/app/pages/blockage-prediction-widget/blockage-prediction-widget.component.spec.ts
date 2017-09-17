import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BlockagePredictionService } from 'app/shared/services/blockage-prediction.service';
import { BlockagePredictionWidgetComponent } from './blockage-prediction-widget.component';
import { NavigationService } from 'app/navigation/navigation.service';
import { MaterialModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { HttpClient } from 'app/shared/services/http-client';
import { MockBackend } from '@angular/http/testing';
import { DebugElement, Injectable } from '@angular/core';
import { BaseRequestOptions, Http } from '@angular/http';
import { AuthService } from 'app/shared/services/auth.service';
import { RoundPipe } from 'app/shared/pipes/round.pipe';
import { CustomerService } from 'app/shared/services';
import { LocationService } from 'app/shared/services/location.service';

describe('BlockagePredictionWidgetComponent', () => {
  let component: BlockagePredictionWidgetComponent;
  let fixture: ComponentFixture<BlockagePredictionWidgetComponent>;
  let blockagePredictionService: BlockagePredictionService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BlockagePredictionWidgetComponent, RoundPipe],
      imports: [MaterialModule, FormsModule],
      providers: [HttpClient,
        MockBackend, BaseRequestOptions, CustomerService, LocationService, BlockagePredictionService,
        {
          provide: Http, HttpClient,
          useFactory: (mockBackend, options) => {
            return new Http(mockBackend, options);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        { provide: AuthService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockagePredictionWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('BlockagePredictionWidgetComponent should be created', () => {
    expect(component).toBeTruthy();
  });
});
