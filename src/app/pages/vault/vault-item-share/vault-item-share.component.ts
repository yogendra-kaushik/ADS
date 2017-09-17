import { Component, ElementRef, Inject, OnDestroy, ViewEncapsulation } from '@angular/core';
import { DOCUMENT, } from '@angular/platform-browser';
import { MdButtonToggleChange, MD_DIALOG_DATA, MdDialogRef } from '@angular/material';

import { Subscription } from 'rxjs/Subscription';

import { VaultService } from '../vault.service';
import { IVaultLinkShare, IVaultShareDialogData } from 'app/shared/models';

/**
 * Represents the vault share dialog window.
 */
@Component({
  selector: 'app-vault-item-share',
  templateUrl: './vault-item-share.component.html',
  styleUrls: ['./vault-item-share.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VaultItemShareComponent implements OnDestroy {

  /**
   * Represents the uri for the file item.
   */
  public uri: string;

  /**
   * Represents the file that the uri is based on.
   */
  public file: IVaultShareDialogData;

  /**
   * Indicates the loading state of the component.
   */
  public isLoading: boolean;

  /**
   * Represents a value that indicates whether a copy operation was performed.
   */
  public isValueCopied: boolean;

  /**
   * Represents the subscriptions clean-up object.
   */
  private subscriptions = new Array<Subscription>();

  constructor(
    @Inject(DOCUMENT) private angularDocument: any,
    @Inject(MD_DIALOG_DATA) private data: IVaultShareDialogData,
    private dialogRef: MdDialogRef<VaultItemShareComponent>,
    private vaultService: VaultService,
    private elements: ElementRef) {
    this.file = data;
  }

  /**
   * Framework level licecycle hook.
   */
  public ngOnDestroy(): void {
    this.subscriptions.forEach((s: Subscription) => s.unsubscribe());
  }

  public copyShareLink(event: MouseEvent): void {

    // get reference to text area element
    let textAreaElement: HTMLTextAreaElement = this.elements.nativeElement.querySelector('.share-link');

    // ensure that text element was found
    if (textAreaElement == null || this.uri === undefined || this.uri === '') {
      return;
    }

    // select the textarea content
    textAreaElement.select();

    // copy to clipboard
    this.isValueCopied = this.angularDocument.execCommand('copy');

    // clear selection - needed this to make material button toggle work after initial selection
    textAreaElement.selectionStart = textAreaElement.selectionEnd = 0;
  }

  /**
   * Responds to the share time period selection for the file and
   * fetches the share link for that file with the associated time
   * frame allowance.
   * @param event Represents the time period change event.
   */
  public shareTimePeriodChange(event: MdButtonToggleChange): void {

    // set loading state
    this.isLoading = true;

    // reset copied state
    this.isValueCopied = false;

    // query vault service for share link
    let vaultLinkSubscription = this.vaultService
      .getSharedLink(event.value, this.file.id)
      .subscribe((share: IVaultLinkShare) => {

        // set share link
        this.uri = share.link;

        // set loading state to false
        this.isLoading = false;
      });

    this.subscriptions.push(vaultLinkSubscription);
  }
}
