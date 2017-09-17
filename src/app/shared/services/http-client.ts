import { Http, Headers, Response, RequestOptionsArgs } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { Config } from './config';
import { AuthService } from './auth.service';
import { MdSnackBar } from '@angular/material';

@Injectable()
export class HttpClient {
    constructor(
        public http: Http,
        public authService: AuthService,
        private _snackBar: MdSnackBar) { }

    public createAuthorizationHeader(options: RequestOptionsArgs): RequestOptionsArgs {

        let requestOptions = options || <RequestOptionsArgs>{};

        let token = this.authService.authToken;

        if (requestOptions.headers === undefined) {
            requestOptions.headers = new Headers();
        }

        requestOptions.headers.append('Content-Type', 'application/json');

        if (token) {
            requestOptions.headers.append('Authorization', `Bearer ${token}`);
        }

        return requestOptions;
    }

    public get(url: string, options?: RequestOptionsArgs) {

        // setup headers
        let requestOptions = this.createAuthorizationHeader(options);

        return this.http.get(url, requestOptions)
            .map(res => {
                if (res.text() === 'No Data Available') {

                } else {
                    return res.text().length > 0 ? res.json() : null
                }
            })
            .catch((err: any) => {
                return this.handleException(err);
            });
    }

    public post(url: string, model: any, options?: RequestOptionsArgs) {

        // setup headers
        let requestOptions = this.createAuthorizationHeader(options);

        return this.http.post(url, JSON.stringify(model), requestOptions)
            .map(res => res.text().length > 0 ? res.json() : null)
            .catch((err: any) => {
                return this.handleException(err);
            });
    }

    public put(url: string, model: any, options?: RequestOptionsArgs) {

        // setup headers
        let requestOptions = this.createAuthorizationHeader(options);


        return this.http.put(url, JSON.stringify(model), requestOptions)
            .map(res => res.text().length > 0 ? res.json() : null)
            .catch((err: any) => {
                return this.handleException(err);
            });
    }

    public delete(url: string, options?: RequestOptionsArgs) {

        // setup headers
        let requestOptions = this.createAuthorizationHeader(options);

        return this.http.delete(url, requestOptions).catch((err: any) => {
            return this.handleException(err);
        });
    }

    private handleException(err: any) {
        if (err.statusText === 'Unauthorized') {
            alert('Your session has been expired,please re-login.');
            location.reload();
        } else {
            console.log(err.message || `Something went wrong while calling api.`);
            return Observable.throw(err);
        }
    }
}
