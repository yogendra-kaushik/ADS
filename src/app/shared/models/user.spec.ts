/* tslint:disable:no-unused-variable */

import { async, inject } from '@angular/core/testing';
import { User } from './user';

describe('User', () => {
  it('should create an instance', () => {
     let data = {
  userId: 0,
  email: '',
  username: '',
  password: '',
  rememberMe: false,
  resetCode: null,
  firstName: '',
  lastName: '',
  userType: 'USER',
  loginAttempts:  0,
  disabled : false,
  lastLogin: '',
  createdTime: '',
  _customerId: 1
     };
    expect(new User(data)).toBeTruthy();
  });
});
