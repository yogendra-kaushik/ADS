/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AuthService } from './auth.service';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let authService: AuthService;
  let mockAdalService;

  beforeEach(() => {
    mockAdalService = jasmine.createSpyObj('mockAdalService',
      ['init', 'login', 'logOut', 'handleWindowCallback', 'getUser', 'userInfo']);

    mockAdalService.userInfo.and.returnValue({
      isAuthenticated: true, profile: {
        name: 'Test User', email: 'test@email.com'
      }
    });

    authService = new AuthService(mockAdalService);
  });

  describe('init', () => {
    it('should initialize the authService via AdalService.', () => {

      authService.init();
      expect(mockAdalService.init).toHaveBeenCalled();
      expect(mockAdalService.handleWindowCallback).toHaveBeenCalled();
      expect(mockAdalService.getUser).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should login to the application', () => {
      authService.login();
      expect(mockAdalService.login).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should logOut to the application', () => {
      authService.logout();
      expect(mockAdalService.logOut).toHaveBeenCalled();
    });
  });
});
