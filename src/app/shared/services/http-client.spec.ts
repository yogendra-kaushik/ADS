
import { HttpModule, ResponseOptions, Headers, Response, Http, BaseRequestOptions, RequestMethod, RequestOptionsArgs } from '@angular/http';
import { TestBed, async, inject } from '@angular/core/testing';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient } from './http-client';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

describe('HttpClient', () => {
    let httpClient: HttpClient;
    let mockHttp, mockAuthService;

    beforeEach(() => {
        mockHttp = jasmine.createSpyObj('mockHttp', ['get', 'post', 'put', 'delete']);
        mockAuthService = jasmine.createSpyObj('mockAuthService', ['authToken']);

        httpClient = new HttpClient(mockHttp, mockAuthService, null);
    });

    describe('createAuthorizationHeader', () => {
        it('should create/append header with content-type and authToken', () => {
            mockAuthService.authToken.and.returnValue('some-token');
            let expectedToken = 'Bearer some-token';

            let options = httpClient.createAuthorizationHeader(<RequestOptionsArgs>{});

            expect(options.headers.has('Content-Type')).toBeTruthy();
            expect(options.headers.get('Content-Type')).toBe('application/json');
            expect(options.headers.has('Authorization')).toBeTruthy();
        });
    });

    describe('get', () => {
        it('should return observable response from HttpRequest in json format', () => {
            let mockResponse = new Response(new ResponseOptions({
                body: JSON.stringify({ id: 1, name: 'Hello World' })
            }));
            mockHttp.get.and.returnValue(Observable.of(mockResponse));

            let url = 'http://example.com';
            httpClient.get(url).subscribe(res => {
                expect(res).toBeDefined();
                expect(res.id).toEqual(1);
                expect(res.name).toEqual('Hello World');
            });
            expect(mockHttp.get).toHaveBeenCalledWith(url, jasmine.any(Object));
        });
    });

    describe('post', () => {
        it('should post model via. HttpRequest', () => {
            let mockResponse = new Response(new ResponseOptions({
                body: JSON.stringify({ status: 200, message: 'success' })
            }));
            mockHttp.post.and.returnValue(Observable.of(mockResponse));

            let url = 'http://example.com';
            let model = { id: 1, name: 'Misko' };

            httpClient.post(url, model).subscribe(res => {
                expect(res).toBeDefined();
                expect(res.status).toEqual(200);
                expect(res.message).toEqual('success');
            });
            expect(mockHttp.post).toHaveBeenCalledWith(url, JSON.stringify(model), jasmine.any(Object));
        });
    });

    describe('put', () => {
        it('should call put HttpRequest', () => {
            let mockResponse = new Response(new ResponseOptions({
                body: JSON.stringify({ status: 200, message: 'success' })
            }));
            mockHttp.put.and.returnValue(Observable.of(mockResponse));

            let url = 'http://example.com';
            let model = { id: 1, name: 'Misko' };

            httpClient.put(url, model).subscribe(res => {
                expect(res).toBeDefined();
                expect(res.status).toEqual(200);
                expect(res.message).toEqual('success');
            });
            expect(mockHttp.put).toHaveBeenCalledWith(url, JSON.stringify(model), jasmine.any(Object));
        });
    });

    describe('delete', () => {
        it('should call delete HttpRequest', () => {
            let mockResponse = new Response(new ResponseOptions({
                status: 200,
                body: JSON.stringify({ status: 200, message: 'success' })
            }));
            mockHttp.delete.and.returnValue(Observable.of(mockResponse));

            let url = 'http://example.com';
            let model = { id: 1, name: 'Misko' };

            httpClient.delete(url).subscribe(res => {
                expect(res).toBeDefined();
                expect(res.status).toEqual(200);
            });
            expect(mockHttp.delete).toHaveBeenCalledWith(url, jasmine.any(Object));
        });
    });
});
