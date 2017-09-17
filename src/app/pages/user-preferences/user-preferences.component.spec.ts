import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UserPreferencesComponent } from './user-preferences.component';
import { MaterialModule, MdDialogRef } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient } from 'app/shared/services/http-client';
import { MockBackend } from '@angular/http/testing';
import { BaseRequestOptions } from '@angular/http';
import { Http } from '@angular/http';
import { AuthService } from 'app/shared/services/auth.service';
import { Injectable } from '@angular/core';


@Injectable()
class MockAuthService extends AuthService {
  constructor() {
    super(null);
  }
  init() {
  }
}

class MdDialogRefMock {
}

describe('UserPreferencesComponent', () => {
  let component: UserPreferencesComponent;
  let fixture: ComponentFixture<UserPreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserPreferencesComponent],
      imports: [MaterialModule, BrowserAnimationsModule],
      providers: [HttpClient, MockBackend, BaseRequestOptions,

        {
          provide: Http, HttpClient,
          useFactory: (mockBackend, options) => {
            return new Http(mockBackend, options);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        { provide: AuthService, useClass: MockAuthService },
        { provide: MdDialogRef, useClass: MdDialogRefMock }
      ]
    })
      .compileComponents();
    fixture = TestBed.createComponent(UserPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
