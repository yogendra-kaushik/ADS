import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

import { Subscription } from 'rxjs/Subscription';

import { environment } from 'app/environments/environment';
import { CustomerService, FileService } from 'app/shared/services';
import { FileViewComponent } from 'app/shared/components';
import { FileType, IFileView, ITelemetryImportDatum, IVaultFile, IVaultShareDialogData } from 'app/shared/models';
import { VaultService } from '../vault.service';
import { VaultTelemetryImportComponent } from '../vault-telemetry-import/vault-telemetry-import.component';

@Component({
  selector: 'app-vault-item',
  templateUrl: './vault-item.component.html',
  styleUrls: ['./vault-item.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VaultItemComponent implements OnDestroy, OnInit {

  /**
   * Represents an input for an instance of a file.
   */
  @Input() file: IVaultFile;

  /**
   * Emits a file deletetion action.
   */
  @Output() public delete = new EventEmitter<string>();

  /**
   * Emits a file sharing action.
   */
  @Output() public share = new EventEmitter<IVaultShareDialogData>();

  /**
   * Represents the selected customer surrogate identifier.
   */
  @Input() public selectedCustomerId: number;

  /**
   * Represents the api endpoint host portion of the URI.
   */
  public apiUri = environment.serviceUrl;

  /**
   * Represents the loading state of the component.
   */
  public isLoading: boolean;

  /**
   * Represents a colleciton of subscriptions that will be unsubscribed from on destroy.
   */
  private subscriptions = new Array<Subscription>();

  constructor(
    private customerService: CustomerService,
    private vaultService: VaultService,
    private fileService: FileService,
    private dialog: MdDialog) { }

  /**
   * Lifecycle hook that is called when a directive, pipe or service is destroyed.
   */
  public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe);
  }

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   */
  public ngOnInit(): void {
    // setup subscription for getting customer id from customer change service
    let customerServiceSubscription = this.customerService.customerChange
      .subscribe((customerId: number) => this.selectedCustomerId = customerId);

    this.subscriptions.push(customerServiceSubscription);
  }

  /**
   * Delete click handler.
   * @param event Represents an instance of the MouseEvent.
   * @param id Represents the file surrogate identifier.
   */
  public shareFile(event: MouseEvent, id: string, name: string): void {

    // emit the share file event
    this.share.emit(<IVaultShareDialogData>{ id: id, name: name });
  }

  /**
   * Delete click handler.
   * @param event Represents an instance of the MouseEvent.
   * @param id Represents the file surrogate identifier.
   */
  public deleteFile(event: MouseEvent, id: string): void {

    // set preloader to true. We never have to worry about setting it
    // to false as this action will cause Angular to remove this component
    this.isLoading = true;

    // emit the delete event
    this.delete.emit(id);
  }

  /**
   * Handles file link click event.
   * @param event Represents the mouse click event.
   */
  public fileSelected(event: MouseEvent, fileExtension: string): void {

    // determine if the file is an image
    const isImage = this.fileService.isImageExtension(fileExtension);

    let isText: boolean;

    if (!isImage) {
      // it it is not an image, determine if it is a text file
      isText = this.fileService.isTextExtension(fileExtension);
    }

    // if file is neither text or image, exit immediatly
    if (!isImage && !isText) {
      return;
    }

    const url = new URL((<HTMLAnchorElement>event.target).href || '');

    // setup the file view model to pass to the file view component
    const fileViewModel: IFileView = {
      extension: fileExtension,
      name: this.fileService.getFileNameFromURL(url),
      type: isImage ? FileType.Image : FileType.Text,
      url: url
    }

    // prevent file from downloading by blocking default behavior
    event.preventDefault();

    // open image in dialog
    this.dialog.open(FileViewComponent, {
      data: fileViewModel,
      panelClass: 'vault-file-view-background-panel'
    });
  }

  /**
   * Handles the click event for importing telemetry data from a viable data file.
   * @param event Represents the click event.
   */
  public importTelemetryData(event: MouseEvent): void {

    // setup dialog
    this.dialog.open(VaultTelemetryImportComponent, {
      data: <ITelemetryImportDatum>{
        id: this.file.uri,
        import: this.file.import
      },
      height: '410px',
      panelClass: 'telemetry-import-background-panel',
      width: '680px'
    });
  }
}
