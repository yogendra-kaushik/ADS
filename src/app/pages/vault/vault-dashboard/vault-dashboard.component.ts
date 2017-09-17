import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { environment } from 'app/environments/environment';
import { NavigationService } from 'app/navigation/navigation.service';
import { Config, CustomerService, PreLoaderService } from 'app/shared/services';
import { VaultItemComponent } from '../vault-item/vault-item.component';
import { VaultItemShareComponent } from '../vault-item-share/vault-item-share.component';
import { VaultService } from '../vault.service';
import { IDataTransfer, IVaultDirectory, IVaultFile, IVaultShareDialogData, IVaultUploadResult } from 'app/shared/models';
import { FileUploadDialogComponent } from 'app/shared/components';

@Component({
  selector: 'app-vault-dashboard',
  templateUrl: './vault-dashboard.component.html',
  styleUrls: ['./vault-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class VaultDashboardComponent implements OnInit, OnDestroy {

  /**
   * Represents the observable that will hold the colleciton of files and folders.
   */
  public vaultData: Observable<IVaultDirectory>;

  /**
   * Represents the collection of files that are contained in the currently selected directory.
   * For the initial state, this will be root, so files belonging to the root folder will be
   * contained within this collection.
   */
  public containingFiles = new Observable<Array<IVaultFile>>();

  /**
   * Represents the selected customer;
   */
  public selectedCustomerId: number;

  /**
   * Represents the selected directory
   */
  public currentlySelectedDirectoryId: Observable<string>;

  /**
   * Represents the subscription to the Customer Change observable.
   */
  private subscriptions = new Array<Subscription>();

  constructor(
    private vaultService: VaultService,
    private preloaderService: PreLoaderService,
    private customerService: CustomerService,
    private navigationService: NavigationService,
    private dialog: MdDialog) { }

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized
   */
  public ngOnInit() {

    // hide side-nav
    this.navigationService.setSidenavOpened(false);

    // set customer current customer id
    this.selectedCustomerId = this.customerService.customerId;

    // setup observable for directory change notifications
    this.currentlySelectedDirectoryId = this.vaultService.CurrentDirectory;

    // setup subscription for getting customer id from customer change service
    let customerServiceSubscription = this.customerService.customerChange
      .subscribe((customerId: number) => {

        // set current customer id
        this.selectedCustomerId = customerId;

        // set root as current directory
        this.vaultService.setCurrentDirectory('/');
      });

    // push subscription to collection of subscriptions for cleanup
    this.subscriptions.push(customerServiceSubscription);

    // setup initial data load
    this.vaultData = this.vaultService.Vault;

    this.containingFiles = this.vaultService.CurrentFiles;

    // setup listeners for customer change
    this.onCustomerChange();
  }

  /**
   * Lifecycle hook that is called when a directive, pipe or service is destroyed.
   */
  public ngOnDestroy() {

    // show side-nav
    this.navigationService.setSidenavOpened(true);

    // unsubscribe from customer change event
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  /**
   * Handles the response for the click event of the selected directory.
   * @param id Represents the surrogate id of the selected diretory.
   */
  public directorySelected(id: string): void {

    this.vaultService.getFilesForDirectory(id);
  }

  /**
   * Represents the handler for opening the Upload window.
   * @param Represents the MouseEvent.
   */
  public openUploadDialog($event): void {

    // setup initial url
    let url = `${Config.urls.vaultUpload}?cid=${this.customerService.customerId}`;

    let currentlySelectedDirectory = '';

    this.vaultService.CurrentDirectory.subscribe((directory: string) => currentlySelectedDirectory = directory).unsubscribe();

    if (currentlySelectedDirectory.length > 0) {
      url = `${url}&uri=${currentlySelectedDirectory}`;
    }

    let uploadDialog = this.dialog.open(FileUploadDialogComponent, {
      data: <IDataTransfer>{
        id: url
      },
      height: '410px',
      panelClass: 'file-upload-background-panel',
      width: '640px'
    });

    let that = this;

    // setup dialog close handler subscription
    let postUploadSubscription =
      uploadDialog
        .afterClosed()
        .subscribe(() => {

          // initiate pre-loader
          that.preloaderService.start();

          // get the latest vault data for current customer and stop preloader
          that.vaultService
            .getRootVaultListForCustomer()
            .subscribe(() => that.preloaderService.stop());
        });

    // add subscription to subscription collection for cleanup
    this.subscriptions.push(postUploadSubscription);
  }

  /**
   * Represents the file share handler.
   * @param id The vault file surrogate identifier.
   * @param name The vault file name.
   */
  public shareFile(fileShareData: IVaultShareDialogData) {
    this.dialog.open(VaultItemShareComponent, {
      data: fileShareData,
      height: '275px',
      panelClass: 'file-upload-background-panel',
      width: '640px'
    });
  }

  /**
   * Represents the file remove handler.
   * @param id The vault file surrogate identifier.
   */
  public removeFile(id: string) {
    this.vaultService.removeFile(id);
  }

  /**
   * Handles setup of data upon customer change.
   */
  private onCustomerChange(): void {

    // subscribe to customer change Observable
    let customerServiceSubscription = this.customerService.customerChange.subscribe((customerId: number) => {

      // initate the preloader
      this.preloaderService.start();

      // get reference to retrieving the potential customers
      this.vaultService.getRootVaultListForCustomer()
        .subscribe(() => this.preloaderService.stop());
    });

    this.subscriptions.push(customerServiceSubscription);
  }
}
