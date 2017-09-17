/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { HttpModule, ResponseOptions, Response, Http, BaseRequestOptions, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs';

import { CustomerService } from './customer.service';
import { Customer } from '../../shared/models/customer';
import { Config } from './config';
import { HttpClient } from './http-client';
import { AuthService } from './auth.service';
import { AdalService } from 'ng2-adal/services/adal.service';
import { MaterialModule } from '@angular/material';

describe('CustomerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, MaterialModule],
      // tslint:disable-next-line:max-line-length
      providers: [CustomerService, HttpClient, AuthService, AdalService,
        {
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

  describe('getCustomers()', () => {

    it('should ...', inject([CustomerService], (service: CustomerService) => {
      expect(service).toBeTruthy();
    }));

    it('should return an Observable<Array<Customer>',
      inject([CustomerService, MockBackend], (customerService, mockBackend) => {
        const mockResponse = [
          {
            'customerID': 63,
            'customerName': 'Fulton County, GA'
          },
          {
            'customerID': 164,
            'customerName': 'Garden City, MI'
          }
        ];

        mockBackend.connections.subscribe((connection) => {
          connection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockResponse)
          })));
        });
        // make the fake call to get customers.
        customerService.getCustomers().subscribe((customers) => {
          // Validate the length of response.
          expect(customers[0].customerID).toBe(63);
          expect(customers[0].customerName).toBe(mockResponse[0].customerName);
          expect(customers[1].customerID).toBe(164);
          expect(customers[1].customerName).toBe(mockResponse[1].customerName);
        });
      }));

    it('should do something async', (done) => {
      setTimeout(() => {
        expect(true).toBe(true);
        done();
      }, 2000);
    });
  });
});
