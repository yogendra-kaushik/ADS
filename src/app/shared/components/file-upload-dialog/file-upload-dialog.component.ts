import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';

import { FileUploader, FileUploaderOptions, FileItem } from 'ng2-file-upload';

import { IDataTransfer, IVaultUploadResult } from 'app/shared/models';

/**
 * Represnts a reusable upload dialog component.
 * @description
 * This component requires the IUploadDatum to be populated with
 * the URI of where the uploads are to go.
 *
 * It is to be invoked by using the Dialog Reference:
 * {@example
 * this.dialog.open(FileUploadDialogComponent, {
 *     data: <IUploadDatum>{
 *       uri: Config.urls.vaultUpload
 *     }
 *  });
 * }
 * See {@linkDocs https://material.angular.io/components/dialog/overview}
 */
@Component({
  selector: 'app-file-upload-dialog',
  templateUrl: './file-upload-dialog.component.html',
  styleUrls: ['./file-upload-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class FileUploadDialogComponent implements OnInit {

  /**
   * Represents the third party uploading library.
   */
  public uploader: FileUploader;

  /**
   * Indicates whether a file over event has been performed.
   */
  public hasBaseDropZoneOver = false;

  /**
   * Indicates whether a file drop event has been performed.
   */
  public hasFileDropped = false;

  /**
   * Indicates how many files were
   */
  public selectedFileCount = 0;

  /**
   * Indicates how many failed uploads occured.
   */
  public uploadFailCount = 0;

  /**
   * Indicates how many files were uploaded succesfully.
   */
  public uploadedFileCount = 0;

  /**
   * Indicates whether all uploads have finished.
   */
  public hasFinished = false;

  /**
   * Represnts a colleciton of uploads that failed.
   */
  public failedUploads = new Array<string>();

  /**
   * Represents the results of the upload. This is used to track the files
   * that are going to be uploaded and their state post upload attempt.
   */
  private uploadResults = new Array<IVaultUploadResult>();

  constructor(
    private dialogRef: MdDialogRef<FileUploadDialogComponent>,
    @Inject(MD_DIALOG_DATA) private dialogData: IDataTransfer,
    private changeDetector: ChangeDetectorRef) {

    this.setupUploadingHandlers();
  }

  /**
   * Framework level licecycle hook.
   */
  public ngOnInit(): void {

    // setup te uploader object for the third party library
    this.uploader = new FileUploader(<FileUploaderOptions>{
      autoUpload: true,
      disableMultipart: false,
      itemAlias: 'files',
      url: this.dialogData.id
    });
  }

  /**
   * Handles the drag-over event for the target area.
   * @param isFileOver Indicates whether a file is over the drop zone.
   */
  public fileOverBase(isFileOver: boolean): void {

    // set the state of hover
    this.hasBaseDropZoneOver = isFileOver;
  }

  /**
   * Handles the drop files event.
   * @param files Represents the dropped files.
   */
  public fileDrop(files: FileList): void {

    // reset the current state
    this.resetState();

    // set a value indicating whether
    let hasFiles = files.length > 0;

    // set files dropped
    this.hasFileDropped = hasFiles;

    // set the selected file count to the amount of dropped files
    this.selectedFileCount = files.length;

    for (let i = 0; i < files.length; i++) {
      let file: File = files.item(i);

      // add each file to the potential file uploads
      this.uploadResults.push(<IVaultUploadResult>{ fileName: file.name, isSuccess: false });
    }
  }

  /**
   * Handles the change event for manually selecting files.
   * @param event Represents the input elemetn change event.
   */
  public fileSelectChangeHandler(event: MouseEvent): void {

    // reset the current state
    this.resetState();

    // set files dropped since we have files that were added
    this.hasFileDropped = true;

    // get the reference to the target element
    let inputElement = <HTMLInputElement>(event.target);

    // ensure that there are files, if not, reset state and exit immediatly
    if (inputElement.files.length < 1) {
      return this.resetState();
    }

    // placeholder array for potential files
    let files = new Array<File>();

    // get files out of a FileList collection and into an array for third party library
    for (let i = 0; i < inputElement.files.length; i++) {

      let file = inputElement.files.item(i);

      files.push(file);

      // add each file to the potential file uploads
      this.uploadResults.push(<IVaultUploadResult>{ fileName: file.name, isSuccess: false });
    }

    // set the selected files to the amount of files contained within target element
    this.selectedFileCount = files.length;

    // add all files to queue for immediate dispatch
    this.uploader.addToQueue(files);
  }


  /**
   * Resets the common state of the file upload variables.
   */
  public resetState(): void {

    // reset drop state
    this.hasFileDropped = false;

    // reset finished state to
    this.hasFinished = false;

    // reset the error state
    this.failedUploads = new Array<string>();

    // reset file count states
    this.selectedFileCount = this.uploadedFileCount = this.uploadFailCount = 0;

    // repoint array
    this.uploadResults = new Array<IVaultUploadResult>();
  }

  /**
   * Handles setting up handlers for the file uploader.
   */
  private setupUploadingHandlers(): void {
    // set context of this as hooks will be processed in the context of the ng2-file-upload library
    // and so this will point to that instance
    let that = this;

    // set hook for erroring on an upload of an item
    FileUploader.prototype.onErrorItem = (item: FileItem, response: string, status: number, headers: any): void => {

      // increment the failed amount of uploads
      that.uploadFailCount = that.uploadFailCount + 1;

      that.updateUploadAttempt(item, Number(status));
    };

    // set hook for notification of upload completion
    FileUploader.prototype.onCompleteAll = (): void => {

      // sett the uploaded file count to be the difference of the selected files and the actual uploaded files
      that.uploadedFileCount = that.selectedFileCount - that.uploadFailCount;

      // set upload finished state to true
      that.hasFinished = true;

      // check if errors exist
      that.failedUploads = that.uploadResults
        .filter((result: IVaultUploadResult) => !result.isSuccess)
        .map((result: IVaultUploadResult) => {
          if (!result.isSuccess) {
            return result.fileName
          }
        });

      this.changeDetector.detectChanges();

      // if there are errors
      if (that.failedUploads.length > 0) {
        return;
      }

      // finish upload
      that.handleModalClose();
    };

    // set hoook for updating each file pre-upload
    FileUploader.prototype.onBeforeUploadItem = (item: FileItem) => {

      // don't send credentials as angular framework will take care of this
      item.withCredentials = false;
    };

    // set hook for the completion of an item
    FileUploader.prototype.onCompleteItem = (item: FileItem, response: string, status: number, headers: any): void => {

      this.updateUploadAttempt(item, Number(status));
    }
  }

  /**
   * Updates a collection of upload attempts and sets their success rate.
   * @param fileItem The file item to use for updating the upload attempt.
   * @param httpStatusResult The HTTP status code returned during the upload attempt.
   */
  private updateUploadAttempt(fileItem: FileItem, httpStatusResult: number): void {

    // iterate over all of the attempted uploads
    for (let i = 0; i < this.uploadResults.length; i++) {

      // get attepmted file reference
      let file: IVaultUploadResult = this.uploadResults[i];

      // if the names of the completed item don't match, move on
      if (file.fileName !== fileItem.file.name) {
        continue;
      }

      // set success rate
      file.isSuccess = httpStatusResult < 299;
    }
  }

  /**
   * Hanldes the cleanup of the dialog window.
   * @param files the file collection that was submitted for uploading.
   */
  private handleModalClose(): void {

    // close the dialog
    this.dialogRef.close();
  }
}
