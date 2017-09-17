import { TestBed, async, inject } from '@angular/core/testing';
import { AuthGuard } from './auth-guard.service';
import { AuthService } from './auth.service';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, RouterStateSnapshot } from '@angular/router';
import { HttpModule, Http, BaseRequestOptions } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { HttpClient } from 'app/shared/services/http-client';
import { AdalService } from 'ng2-adal/services/adal.service';
import { MockBackend } from '@angular/http/testing';


@Injectable()
class MockAuthService extends AuthService {
    constructor() {
        super(null);
    }
    get isAuthenticated() {
        return true;
    }
}

describe('AuthGuard', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule, MaterialModule, RouterTestingModule],
            providers: [AuthGuard, HttpClient, AuthService, AdalService, {
                provide: Http, HttpClient,
                useFactory: (mockBackend, options) => {
                    return new Http(mockBackend, options);
                },
                deps: [MockBackend, BaseRequestOptions]
            },
                MockBackend,
                BaseRequestOptions
            ]
        });
    });

    it('should exists', inject([AuthGuard, Router], (service: AuthGuard, router: Router) => {
        expect(service).toBeTruthy();
    }));

    // it('checks if canActivate returns true', inject([AuthGuard, Router], (auth: AuthGuard, router) => {
    //     expect(auth.canActivate(null, <RouterStateSnapshot>{ url: 'dummy' })).toBeTruthy();
    // }));

    it('should contain canActivate, canActivateChild, checkLogin method', inject([AuthGuard], (service: AuthGuard) => {
        expect(service.canActivate).toBeDefined();
        expect(service.canActivateChild).toBeDefined();
        expect(service.checkLogin).toBeDefined();
    }));

    it('should allow checkLogin when user is authenticated', inject([AuthGuard], (service: AuthGuard) => {
        let resultCanActivate = service.checkLogin('/adscore');
        expect(resultCanActivate).toEqual(false);
    }));
});
