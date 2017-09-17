import { EventEmitter, Injectable } from '@angular/core';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

import { AdalService } from 'ng2-adal/services/adal.service';
import { Observable } from 'rxjs/Observable';
import { User } from '../models/user';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {
  redirectUrl: string;

  constructor(private adalService: AdalService) {
    this.init();
   }

  private get adalConfig(): any {
    return environment.adalConfig;
  }

  get isAuthenticated() {
    return this.adalService.userInfo.isAuthenticated;
  }

  get user() {
    if (!this.isAuthenticated) {
      return null;
    }
    return {
      name: this.adalService.userInfo.profile.name,
      email: this.adalService.userInfo.profile.email,
      id: this.adalService.userInfo.profile.id,
    };
  }

  init() {
    this.adalService.init(this.adalConfig);
    this.adalService.handleWindowCallback();
    this.adalService.getUser();
  }

  login() {
    this.adalService.login();
  }

  logout() {
    this.adalService.logOut();
  }

  get authToken() {
    return sessionStorage.getItem('adal.idtoken');
  }
}
