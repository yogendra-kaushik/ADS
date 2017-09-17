import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MdDialogRef, MdSnackBar, MdSnackBarRef, SimpleSnackBar, MdDialog } from '@angular/material';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { UUID } from 'angular2-uuid';
import { Subscription } from 'rxjs/Subscription';
import { CustomerService } from 'app/shared/services/customer.service';
import { Customer } from 'app/shared/models/customer';

@Component({
  selector: 'customer-editor',
  templateUrl: './customer-editor.component.html',
  styleUrls: ['./customer-editor.component.scss']
})

export class CustomerEditorComponent implements OnInit, OnDestroy {
  showUpdateCustomerEditor: boolean;
  showNewCustomerEditor: boolean;
  customers = new Array<Customer>();
  customer: Customer;
  isValidCustomerName: boolean;
  isCustomerNameErrorDisplay: boolean;
  isValidCustomerShortName: boolean;
  customerName: string;
  shortName: string;
  flowViewFlag: boolean;
  Units: number;
  customerID: number;
  isActive: boolean;
  UnitsofMeasure: any[];
  DateFormatType: any[];
  TimeFormatType: any[];
  TimeZoneType: any[];
  DateFormat: string;
  TimeFormat: string;
  TimeZone: any;
  daylightSavingFlag: boolean;
  headerName = 'CUSTOMER EDITOR';
  uuid: UUID;
  pagedItems = new Array<Customer>();
  setFirstPage: boolean;
  showPagination = true;
  private subscriptions = new Array<Subscription>();
  showNewLocationEditor: boolean;

  public customersLoadingState: boolean;

  constructor(private customerService: CustomerService,
    private dialogRef: MdDialogRef<CustomerEditorComponent>,
    private _snackBar: MdSnackBar,
    private cdr: ChangeDetectorRef,
    private _dialog: MdDialog) { }

  ngOnInit() {
    this.loadCustomers();
    this.UnitsofMeasure = [
      { value: '1', text: 'US Standard CFS' },
      { value: '3', text: 'US Standard MGD' },
      { value: '2', text: 'Metric' }
    ];
    this.DateFormatType = [
      { value: 'MM/DD/YYYY', text: 'MM/DD/YYYY' },
      { value: 'DD/MM/YYYY', text: 'DD/MM/YYYY' },
      { value: 'YYYY/MM/DD', text: 'YYYY/MM/DD' }
    ];
    this.TimeFormatType = [
      { value: 'h:mm:ss tt', text: '12 hour' },
      { value: 'hh:mm:ss', text: '24 hour' }
    ];

    this.TimeZoneType = [
      { value: 'UTC', text: 'Universal Coordinated Time', utcValue: 'UTC' },
      { value: 'ECT', text: 'European Central Time', utcValue: 'UTC+1:00' },
      { value: 'EET', text: 'Eastern European Time', utcValue: 'UTC+2:00' },
      { value: 'ART', text: '(Arabic) Egypt Standard Time', utcValue: 'UTC+2:00' },
      { value: 'EAT', text: 'Eastern African Time', utcValue: 'UTC+3:00' },
      { value: 'MET', text: 'Middle East Time', utcValue: 'UTC+3:30' },
      { value: 'NET', text: 'Near East Time', utcValue: 'UTC+4:00' },
      { value: 'PLT', text: 'Pakistan Lahore Time', utcValue: 'UTC+5:00' },
      { value: 'IST', text: 'India Standard Time', utcValue: 'UTC+5:30' },
      { value: 'BST', text: 'Bangladesh Standard Time', utcValue: 'UTC+6:00' },
      { value: 'VST', text: 'Vietnam Standard Time', utcValue: 'UTC+7:00' },
      { value: 'CTT', text: 'China Taiwan Time', utcValue: 'UTC+8:00' },
      { value: 'JST', text: 'Japan Standard Time', utcValue: 'UTC+9:00' },
      { value: 'ACT', text: 'Australia Central Time', utcValue: 'UTC+9:30' },
      { value: 'AET', text: 'Australia Eastern Time', utcValue: 'UTC+10:00' },
      { value: 'SST', text: 'Solomon Standard Time', utcValue: 'UTC+11:00' },
      { value: 'NST', text: 'New Zealand Standard Time', utcValue: 'UTC+12:00' },
      { value: 'MIT', text: 'Midway Islands Time', utcValue: 'UTC-11:00' },
      { value: 'HST', text: 'Hawaii Standard Time', utcValue: 'UTC-10:00' },
      { value: 'AST', text: 'Alaska Standard Time', utcValue: 'UTC-9:00' },
      { value: 'PST', text: 'Pacific Standard Time', utcValue: 'UTC-8:00' },
      { value: 'PNT', text: 'Phoenix Standard Time', utcValue: 'UTC-7:00' },
      { value: 'MST', text: 'Mountain Standard Time', utcValue: 'UTC-7:00' },
      { value: 'CST', text: 'Central Standard Time', utcValue: 'UTC-6:00' },
      { value: 'EST', text: 'Eastern Standard Time', utcValue: 'UTC-5:00' },
      { value: 'IET', text: 'Indiana Eastern Standard Time', utcValue: 'UTC-5:00' },
      { value: 'PRT', text: 'Puerto Rico and US Virgin Islands Time', utcValue: 'UTC-4:00' },
      { value: 'CNT', text: 'Canada Newfoundland Time', utcValue: 'UTC-3:30' },
      { value: 'AGT', text: 'Argentina Standard Time', utcValue: 'UTC-3:00' },
      { value: 'BET', text: 'Brazil Eastern Time', utcValue: 'UTC-3:00' },
      { value: 'CAT', text: 'Central African Time', utcValue: 'UTC-1:00' }
    ];

    this.customerService.getTimeZone().subscribe(res => {
      this.TimeZone = res;
    });

    this.showNewLocationEditor = false;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  openCreateCustomerEditor() {
    this.headerName = 'ADD NEW CUSTOMER';
    this.showNewCustomerEditor = true;
    this.showUpdateCustomerEditor = false;
    this.resetCustomerForm();
  }

  loadCustomers(loaderState?: boolean) {
    if (loaderState === false) {
      this.customersLoadingState = false;
    } else {
      this.customersLoadingState = true;
    }
    let subscription = this.customerService.getCustomers().subscribe(res => {
      this.customers = res;
      this.customersLoadingState = false;
      if (this.customers !== undefined && this.customers.length > 10) {
        this.showPagination = false;
      } else {
        this.showPagination = true;
      }
    }, error => this.customersLoadingState = false);
    this.subscriptions.push(subscription);
  }

  public showCustomerPageRecords(pagedItems: Customer[]) {
    this.pagedItems = pagedItems;
    this.cdr.detectChanges();
  }


  validateDuplicateCustomerName() {
    this.customerName = this.customerName.trim();
    if (this.customerName !== null) {
      if (this.customers.find(x => x.customerName.toLowerCase() === this.customerName.toLowerCase())) {
        this.isValidCustomerName = false;
      } else {
        this.isValidCustomerName = true;
      }
    }
  }

  validateShortDuplicateCustomerName() {
    this.shortName = this.shortName.trim();
    if (this.customers.find(x => x.shortName.toLowerCase() === this.shortName.toLowerCase())) {
      this.isValidCustomerShortName = false;
    } else {
      this.isValidCustomerShortName = true;
    }
  }

  addCustomer() {
    this.customersLoadingState = true
    this.headerName = 'CUSTOMER EDITOR';
    let newCustomer = new Customer();
    newCustomer.customerName = this.customerName;
    if (!this.showUpdateCustomerEditor) {
      newCustomer.shortName = this.shortName;
    } else {
      newCustomer.customerID = this.customer.customerID;
      newCustomer.shortName = this.customer.shortName;
    }
    newCustomer.isActive = true;
    newCustomer.isNewCollect = this.flowViewFlag || false;
    newCustomer.unitsType = this.Units;
    newCustomer.dateFormat = this.DateFormat;
    newCustomer.timeFormat = this.TimeFormat;
    newCustomer.timeZone = this.TimeZone;
    newCustomer.isDaylightSavings = this.daylightSavingFlag || false;

    let message = null;

    if (this.showUpdateCustomerEditor) {
      message = ' updated';
      let subscription = this.customerService.updateCustomer(newCustomer, this.customer.customerID).subscribe(
        res => {
          this.customersLoadingState = false;
          let snackbarRef: MdSnackBarRef<SimpleSnackBar> = this._snackBar.open(this.customerName + ' was successfully updated', '');
          setTimeout(snackbarRef.dismiss.bind(snackbarRef), 3000);
          this.exitCustomerEditor(event);
        }, error => this.customersLoadingState = false
      );
      this.subscriptions.push(subscription);

    } else if (!this.showUpdateCustomerEditor) {
      message = ' created';
      let subscription2 = this.customerService.addCustomer(newCustomer).subscribe(
        res => {
          if (res.customerID > 0) {
            this.customer = res;
            this.customersLoadingState = true;
            let snackbarRef: MdSnackBarRef<SimpleSnackBar> = this._snackBar.open(this.customerName + message + ' successfully', '');
            setTimeout(snackbarRef.dismiss.bind(snackbarRef), 3000);
            this.showNewCustomerEditor = false;
            this.loadCustomers();
            this.cdr.detectChanges();
          } else {
            let snackbarRef: MdSnackBarRef<SimpleSnackBar> = this._snackBar.open('Something went wrong creating' + this.customerName);
            setTimeout(snackbarRef.dismiss.bind(snackbarRef), 3000);
          }
        }, error => this.customersLoadingState = false
      );
      this.subscriptions.push(subscription2);
    }
  }

  emitCustomerEditor() {
    this.dialogRef.close({ success: false });
  }

  updateCustomer(customerId: number) {
    this.customerID = customerId;
    this.openCreateCustomerEditor();
    this.showUpdateCustomerEditor = true;
    this.headerName = 'EDIT CUSTOMER';
    let subscription = this.customerService.getCustomerById(customerId).subscribe(
      res => {
        this.customer = res;
        this.customerName = this.customer.customerName;
        this.shortName = this.customer.shortName;
        this.customerID = this.customer.customerID;
        this.isActive = this.customer.isActive;
        this.flowViewFlag = this.customer.isNewCollect;
        this.Units = this.customer.unitsType;
        this.DateFormat = this.customer.dateFormat;
        this.TimeFormat = this.customer.timeFormat;
        this.TimeZone = this.customer.timeZone;
        this.daylightSavingFlag = this.customer.isDaylightSavings;
        this.isValidCustomerName = true;
        this.isValidCustomerShortName = true;
        for (let i = 0; i < this.customers.length; i++) {
          if (this.customers[i].customerID === this.customer.customerID) {
            this.customers.splice(i, 1);
            break;
          }
        }
      }
    );
    this.subscriptions.push(subscription);
  }

  archiveCustomer(customerId: number, customerName: string) {
    this._dialog.open(ConfirmationDialogComponent, {
      disableClose: true,
      data: {
        title: 'Archive Confirmation',
        message: 'You are about to archive ' + customerName + '. This will make data unavailable through the Core system. Are you sure?',
        okText: 'Yes',
        cancelText: 'No'
      }
    }).afterClosed().subscribe(res => {
      if (res.whichButtorPressed === 'ok') {
        this.customersLoadingState = true;
        let subscription = this.customerService.archiveCustomer(customerId).subscribe(
          response => {
            this.customer = response;
            this.customersLoadingState = false;
          }, error => this.customersLoadingState = false
        );
        this.subscriptions.push(subscription);

        let snackbarRef: MdSnackBarRef<SimpleSnackBar> = this._snackBar.open(customerName + ' archived successfully', '');
        setTimeout(snackbarRef.dismiss.bind(snackbarRef), 3000);
        this.loadCustomers();
        this.cdr.detectChanges();
      }
    });
  }

  exitCustomerEditor(event) {
    this.headerName = 'CUSTOMER EDITOR';
    this.showNewCustomerEditor = false;
    this.showUpdateCustomerEditor = false;
    this.setFirstPage = true;
    this.isValidCustomerName = null;
    this.isValidCustomerShortName = null;
    this.loadCustomers(false);
    this.resetCustomerForm();
    event.preventDefault();
  }

  resetCustomerForm() {
    if (this.showUpdateCustomerEditor) {
      this.customerName = this.customer.customerName;
      this.flowViewFlag = this.customer.isNewCollect;
      this.Units = this.customer.unitsType;
      this.DateFormat = this.customer.dateFormat;
      this.TimeFormat = this.customer.timeFormat;
      this.TimeZone = this.customer.timeZone;
      this.daylightSavingFlag = this.customer.isDaylightSavings;
      this.isValidCustomerName = true;
    } else {
      this.customerName = null;
      this.shortName = null;
      this.flowViewFlag = false;
      this.Units = null;
      this.DateFormat = null;
      this.TimeFormat = null;
      this.TimeZone = null;
      this.daylightSavingFlag = false;
    }
  }

  //
  openNewLocationEditor() {
    this.showNewLocationEditor = true;
  }

  closeNewLocationEditor() {
    this.showNewLocationEditor = false;
  }
}
