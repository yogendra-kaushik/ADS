import { Injectable, Inject } from "@angular/core";
import { HttpClient } from "./http-client";
import { Config } from "./config";
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()
export class PermissionService {

  constructor(@Inject(HttpClient) public http: HttpClient) { }

    getPermissions() {
    return this.http.get(Config.urls.permission);
  }

}
