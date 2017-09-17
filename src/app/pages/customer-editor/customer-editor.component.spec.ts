import { async, ComponentFixture, TestBed, fakeAsync, inject, tick } from '@angular/core/testing';
import { CustomerEditorComponent } from './customer-editor.component';
import { AuthService } from 'app/shared/services/auth.service';
import { Injectable, ChangeDetectorRef } from '@angular/core';
import { MaterialModule, MD_DIALOG_DATA, MdDialogRef, MdSnackBar, MdDialog } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClient } from 'app/shared/services/http-client';
import { MockBackend } from '@angular/http/testing';
import { Http, BaseRequestOptions } from '@angular/http';
import { PagingComponent, AddLocationComponent } from 'app/shared/components';
import { LoaderComponent } from 'app/shared/components/loader/loader.component';
import { CustomerService } from 'app/shared/services/customer.service';
import { Observable } from 'rxjs/Observable';
import { Customer } from 'app/shared/models/customer';

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

class MockCustomerService extends CustomerService {
  constructor() {
    super(null);
  }

  public getCustomers(customersWithLocationsOnly?: boolean) {
    let customer1 = new Customer();
    customer1 = {
      'customerID': 5016,
      'customerName': 'ashish',
      'shortName': 'ashish',
      'isActive': true,
      'isNewCollect': false,
      'unitsType': 0,
      'dateFormat': 'MM/DD/YYYY',
      'timeFormat': 'h:mm:ss tt',
      'timeZone': 'UTC',
      'isDaylightSavings': true
    };

    let customer2 = new Customer();
    customer2 = {
      'customerID': 5009,
      'customerName': 'Dave Company',
      'shortName': 'DaveCo',
      'isActive': true,
      'isNewCollect': false,
      'unitsType': 0,
      'dateFormat': 'MM/DD/YYYY',
      'timeFormat': 'h:mm:ss tt',
      'timeZone': 'UTC',
      'isDaylightSavings': true
    };

    let result = [customer1, customer2];

    return Observable.of(result);
  }

  public getTimeZone() {
    let result = 'UTC';
    return Observable.of(result);
  }

  public addCustomer(newCustomer: Customer) {
    let response = {
      'customerID': 9,
      'customerName': 'Sasha',
      'shortName': 'sas',
      'isActive': true,
      'isNewCollect': true,
      'unitsType': 1,
      'dateFormat': 'MM/DD/YYYY',
      'timeFormat': 'hh:mm:ss',
      'timeZone': 'UTC',
      'isDaylightSavings': true
    }

    return Observable.of(response);
  }

  public updateCustomer(newCustomer: Customer, customerId: number) {
    let response = '';
    
    return Observable.of(response);
  }

  public getCustomerById(customerId: number) {
    let response = {
      'customerID': 9,
      'customerName': 'Sasha',
      'shortName': 'sas',
      'isActive': true,
      'isNewCollect': true,
      'unitsType': 1,
      'dateFormat': 'MM/DD/YYYY',
      'timeFormat': 'hh:mm:ss',
      'timeZone': 'UTC',
      'isDaylightSavings': true
    }

    return Observable.of(response);
  }
}

describe('CustomerEditorComponent', () => {
  let component: CustomerEditorComponent;
  let fixture: ComponentFixture<CustomerEditorComponent>;
  let changeDetectorRef: ChangeDetectorRef;
  let customerService: CustomerService;


  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [CustomerEditorComponent, PagingComponent, AddLocationComponent, LoaderComponent],
      imports: [MaterialModule, BrowserAnimationsModule, FormsModule],
      providers: [HttpClient, MockBackend, BaseRequestOptions,
        { provide: CustomerService, useClass: MockCustomerService },
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
    });

    fixture = TestBed
      .overrideComponent(AddLocationComponent, { set: { template: '<div>Overriden item here</div>' } })
      .overrideComponent(PagingComponent,{ set: { template: '<div>Overriden item here</div>' } })
      .overrideComponent(LoaderComponent,{ set: { template: '<div>Overriden item here</div>' } })

      .createComponent(CustomerEditorComponent);
    component = fixture.componentInstance;
    customerService = fixture.debugElement.injector.get(CustomerService);

    
    this.mockCustomer = new Customer();
    this.mockCustomer = {
      'customerID': 9,
      'customerName': 'Sasha',
      'shortName': 'sas',
      'isActive': true,
      'isNewCollect': true,
      'unitsType': 1,
      'dateFormat': 'MM/DD/YYYY',
      'timeFormat': 'hh:mm:ss',
      'timeZone': 'UTC',
      'isDaylightSavings': true
    };
  }));

  this.customers = [{
    'customerID': 5016,
    'customerName': 'ashish',
    'shortName': 'ashish',
    'isActive': true,
    'isNewCollect': false,
    'unitsType': 0,
    'dateFormat': 'MM/DD/YYYY',
    'timeFormat': 'h:mm:ss tt',
    'timeZone': 'UTC',
    'isDaylightSavings': true
  },
  {
    'customerID': 5009,
    'customerName': 'Dave Company',
    'shortName': 'DaveCo',
    'isActive': true,
    'isNewCollect': false,
    'unitsType': 0,
    'dateFormat': 'MM/DD/YYYY',
    'timeFormat': 'h:mm:ss tt',
    'timeZone': 'UTC',
    'isDaylightSavings': true
  }];


  it('should be created', () => {
    expect(component).toBeTruthy();
  });


  it('should create units of measure, date format types, time format types and time zone types', () => {
    spyOn(component, 'loadCustomers');
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.loadCustomers).toHaveBeenCalled();

    expect(component.UnitsofMeasure).toEqual([
      { value: '1', text: 'US Standard CFS' },
      { value: '3', text: 'US Standard MGD' },
      { value: '2', text: 'Metric' }
    ]);
    expect(component.DateFormatType.length).toEqual(3);
    expect(component.TimeZoneType.length).toBeGreaterThan(0);
    expect(component.showNewLocationEditor).toEqual(false);
  });


  it('should get time zone', fakeAsync(() => {
    spyOn(customerService, 'getTimeZone').and.callThrough();
    component.ngOnInit();
    fixture.detectChanges();
    expect(customerService.getTimeZone).toHaveBeenCalled();
  }));


  it('should open customer editor', () => {
    spyOn(component, 'resetCustomerForm');
    component.openCreateCustomerEditor();
    expect(component.headerName).toEqual('ADD NEW CUSTOMER');
    expect(component.showNewCustomerEditor).toEqual(true);
    expect(component.showUpdateCustomerEditor).toEqual(false);
    expect(component.resetCustomerForm).toHaveBeenCalled();
  });


  it('should load customers', fakeAsync(() => {
    component.loadCustomers();
    fixture.detectChanges();

    customerService.getCustomers().subscribe(
      (result) => {
        expect(component.customers.length).toBeGreaterThan(0);
      }
    )
  }));


  it('should validate customer name', () => {
    component.ngOnInit();
    component.customers = this.customers;
    component.customerName = 'ashish';
    component.validateDuplicateCustomerName();
    expect(component.isValidCustomerName).toEqual(false);
    component.customerName = 'Sasha  ';
    component.validateDuplicateCustomerName();
    expect(component.isValidCustomerName).toEqual(true);
  });


  it('should validate customer short name', () => {
    component.ngOnInit();
    component.customers = this.customers;
    component.shortName = 'ashish';
    component.validateShortDuplicateCustomerName();
    expect(component.isValidCustomerShortName).toEqual(false);

    component.shortName = 'Sasha';
    component.validateShortDuplicateCustomerName();
    expect(component.isValidCustomerShortName).toEqual(true);
  });

  it('should add new customer', fakeAsync(() => {
    component.customerName = this.mockCustomer.customerName;
    component.shortName = this.mockCustomer.shortName;
    component.flowViewFlag = this.mockCustomer.flowViewFlag;
    component.Units = this.mockCustomer.Units;
    component.DateFormat = this.mockCustomer.dateFormat;
    component.TimeFormat = this.mockCustomer.timeFormat;
    component.TimeZone = this.mockCustomer.timeZone;
    component.daylightSavingFlag = this.mockCustomer.daylightSavingFlag;
    component.showUpdateCustomerEditor = false;

    component.customer = {
      'customerID': 9,
      'customerName': 'Sasha 2',
      'shortName': '',
      'isActive': false,
      'isNewCollect': false,
      'unitsType': 2,
      'dateFormat': 'DD/MM/YYYY',
      'timeFormat': 'h:mm:ss tt',
      'timeZone': 'ETC',
      'isDaylightSavings': false
    };
    spyOn(customerService, 'addCustomer').and.returnValue({ subscribe: () => {} });
    component.addCustomer();
    fixture.detectChanges();
    expect(customerService.addCustomer).toHaveBeenCalled();
    expect(component.headerName).toEqual('CUSTOMER EDITOR');
  }));

  it('should edit customer', fakeAsync(() => {
    component.customerName = this.mockCustomer.customerName;
    component.shortName = this.mockCustomer.shortName;
    component.flowViewFlag = this.mockCustomer.flowViewFlag;
    component.Units = this.mockCustomer.Units;
    component.DateFormat = this.mockCustomer.dateFormat;
    component.TimeFormat = this.mockCustomer.timeFormat;
    component.TimeZone = this.mockCustomer.timeZone;
    component.daylightSavingFlag = this.mockCustomer.daylightSavingFlag;
    component.showUpdateCustomerEditor = true;

    component.customer = {
      'customerID': 9,
      'customerName': 'Sasha 2',
      'shortName': '',
      'isActive': false,
      'isNewCollect': false,
      'unitsType': 2,
      'dateFormat': 'DD/MM/YYYY',
      'timeFormat': 'h:mm:ss tt',
      'timeZone': 'ETC',
      'isDaylightSavings': false
    };
    spyOn(customerService, 'updateCustomer').and.returnValue({ subscribe: () => {} });
    component.addCustomer();
    fixture.detectChanges();
    expect(customerService.updateCustomer).toHaveBeenCalled();
  }));


  it('should update customer', fakeAsync(() => {
    spyOn(customerService, 'getCustomerById').and.returnValue({ subscribe: () => { } });
    spyOn(component, 'openCreateCustomerEditor');
    component.updateCustomer(9);
    fixture.detectChanges();
    expect(component.showUpdateCustomerEditor).toEqual(true);
    expect(component.headerName).toEqual('EDIT CUSTOMER');
    expect(component.openCreateCustomerEditor).toHaveBeenCalled();
    expect(customerService.getCustomerById).toHaveBeenCalledWith(9);
  }));

  it('should exit customer editor', () => {
    spyOn(component, 'loadCustomers');
    spyOn(component, 'resetCustomerForm');
    let e = jasmine.createSpyObj('e', ['preventDefault']);

    component.exitCustomerEditor(e);
    expect(component.headerName).toEqual('CUSTOMER EDITOR');
    expect(component.showNewCustomerEditor).toEqual(false);
    expect(component.showUpdateCustomerEditor).toEqual(false);
    expect(component.setFirstPage).toEqual(true);
    expect(component.isValidCustomerName).toEqual(null);
    expect(component.isValidCustomerShortName).toEqual(null);
    expect(component.loadCustomers).toHaveBeenCalled();
    expect(component.resetCustomerForm).toHaveBeenCalled();
    expect(e.preventDefault).toHaveBeenCalled();
  });


  it('should reset customer form', () => {
    component.showUpdateCustomerEditor = true;
    component.customer = this.mockCustomer;
    component.resetCustomerForm();
    expect(component.customerName).toEqual('Sasha');
    expect(component.flowViewFlag).toEqual(true);
    expect(component.Units).toEqual(1);
    expect(component.DateFormat).toEqual('MM/DD/YYYY');
    expect(component.TimeFormat).toEqual('hh:mm:ss');
    expect(component.TimeZone).toEqual('UTC');
    expect(component.daylightSavingFlag).toEqual(true);

    component.showUpdateCustomerEditor = false;
    component.resetCustomerForm();
    expect(component.customerName).toEqual(null);
    expect(component.shortName).toEqual(null);
    expect(component.flowViewFlag).toEqual(false);
    expect(component.Units).toEqual(null);
    expect(component.DateFormat).toEqual(null);
    expect(component.TimeFormat).toEqual(null);
    expect(component.TimeZone).toEqual(null);
    expect(component.daylightSavingFlag).toEqual(false);
  });

  it('should open new location editor', () => {
    component.openNewLocationEditor();
    expect(component.showNewLocationEditor).toEqual(true);
  });

  it('should close new location editor', () => {
    component.closeNewLocationEditor();
    expect(component.showNewLocationEditor).toEqual(false);
  });

});
