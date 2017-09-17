import { Injectable, Inject, EventEmitter } from '@angular/core';
import { HttpClient } from './http-client';
import { Config } from './config';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { Customer } from '../../shared/models/customer';

@Injectable()
export class CustomerService {
  private customerDetails: Customer[] = [];
  private customer: Customer;
  private _customerId: number;
  customerChange: EventEmitter<number> = new EventEmitter<number>();
  constructor( @Inject(HttpClient) public http: HttpClient) { }

  get customerId() {
    return this._customerId;
  }

  set customerId(customerId: number) {
    if (this._customerId !== customerId) {
      this._customerId = customerId;
      this.customerChange.emit(customerId);
    }
  }

  getCustomers(customersWithLocationsOnly?: boolean) {
    if (customersWithLocationsOnly) {
      return this.http.get(Config.serviceUrl + 'api/customers/?getOnlyCustomersWithLocations=' + customersWithLocationsOnly).map(res => {
        this.customerDetails = res;
        return this.customerDetails;
      });
    } else {
      return this.http.get(Config.serviceUrl + 'api/customers').map(res => {
        this.customerDetails = res;
        return this.customerDetails;
      });
    }
    /* TODO Need to remove - only for workaround absence of API.
    return this.http.get(Config.urls.customers.get).map(res => {
      this.customerDetails = res;
      return this.customerDetails;
    });
    */
  }

  getCustomerById(customerId: number) {
    return this.http.get(Config.serviceUrl + `api/customers/${customerId}`).map(res => {
      this.customer = res;
      return this.customer;
    });
  }

  addCustomer(newCustomer: Customer) {
    let res = this.http.post(Config.serviceUrl + `api/customers`, newCustomer);
    res.catch(error => {
      console.dir(error.json());
      return res;
    });
    return res;
  }

  updateCustomer(newCustomer: Customer, customerId: number) {
    let res = this.http.put(Config.serviceUrl + `api/customers/${customerId}`, newCustomer);
    res.catch(error => {
      console.dir(error.json());
      return res;
    });
    return res;
  }

  archiveCustomer(customerID: number) {
    return this.http.put(Config.serviceUrl + `api/customers/${customerID}/archive`, null)
      .map(response => <Customer>response);
  }

  getTimeZone() {
    return this.http.get(Config.urls.timeZone);
  }

  getHydrograph() {
    return this.http.get(Config.urls.hydrograph);
  }

  getPipeElements() {
    return this.http.get(Config.urls.customers.pipeElements);
  }

  getFlowDataGraphics() {
    return this.http.get(Config.urls.customers.flowDataGraphics);
  }

  getIsoQLines() {
    return this.http.get(Config.urls.customers.isoQLines);
  }

  getDayStatusAnalysis() {
    return this.http.get(Config.urls.customers.dayStatusAnalysis);
  }

  getAnalysisBatch() {
    return this.http.get(Config.urls.customers.analysisBatch);
  }

  getDayStausReviewers() {
    return this.http.get(Config.urls.customers.dayStausReviewers);
  }
}
