import { Inject, Injectable, OnDestroy } from '@angular/core';
import { RequestOptionsArgs } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { HttpClient } from '../../shared/services/http-client';

import {
  IVaultDirectory,
  IVaultGetVaultListQueryParams,
  IVaultFile,
  IVaultFileRemoveQueryParams,
  IVaultLinkShare
} from '../../shared/models';
import { Config, CustomerService } from '../../shared/services';

@Injectable()
export class VaultService implements OnDestroy {

  /**
   * Represents an instance of the vault structure.
   */
  private vault = new BehaviorSubject<IVaultDirectory>(null);

  /**
   * Represents the currently selected directory and defaults to root.
   */
  private currentlySelectedDirectory = new BehaviorSubject<string>('/');

  /**
   * Represents the files of the currently selected directory.
   */
  private filesForCurrentlySelectedDirectory = new BehaviorSubject<Array<IVaultFile>>(null);

  /**
   * Represents a placeholder for subscriptions.
   */
  private subscriptions = new Array<Subscription>();

  constructor(
    @Inject(HttpClient) private http: HttpClient,
    private customerService: CustomerService) {
  }

  /**
   * Lifecycle hook that is called when a directive, pipe or service is destroyed.
   */
  public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  /**
   * Retreives a readonly reference to the Vault's current state.
   */
  public get Vault(): BehaviorSubject<IVaultDirectory> {
    return this.vault;
  }

  /**
   * Retreives a readonly reference to the current directories files.
   */
  public get CurrentFiles(): BehaviorSubject<Array<IVaultFile>> {
    return this.filesForCurrentlySelectedDirectory;
  }

  /**
   * Retrieves a readonly reference to the currently selected directory.
   */
  public get CurrentDirectory(): BehaviorSubject<string> {
    return this.currentlySelectedDirectory;
  }

  /**
   * Retrieves the files for the chosen directory.
   * @param id The surrogate id of the chosen directory.
   */
  public getFilesForDirectory(id?: string): void {

    // ensure args and default dir if none passed in
    if (id !== undefined || id === '') {
      this.currentlySelectedDirectory.next(id);
    }

    // get the latest from the vault and immedia
    this.vault.subscribe((vaultDirecotry: IVaultDirectory) => {

      this.currentlySelectedDirectory.subscribe((path: string) => {
        // handle root folder
        if (path === '/') {

          // set files for root
          this.filesForCurrentlySelectedDirectory.next(vaultDirecotry.files);

          // exit immediatly
          return;
        }

        // handle sub folders
        let foundFiles = this.searchVaultForDirectory(path, vaultDirecotry.sub_directories);

        // set found files to new directory
        this.filesForCurrentlySelectedDirectory.next(foundFiles);
      }).unsubscribe(); // immediatly unsubscribe
    }).unsubscribe(); // immediatly unsubscribe
  }

  /**
   * Removes the file from the data store.
   * @param id the file identifier.
   */
  public removeFile(id: string): void {

    // setup options
    let requestOptions: RequestOptionsArgs = {
      params: <IVaultFileRemoveQueryParams>{
        cid: this.customerService.customerId,
        uri: id
      }
    }

    // call delete API and retrieve the latest vault files following the delete
    this.subscriptions.push(this.http.delete(Config.urls.vaultDeleteFile, requestOptions)
      .subscribe(() => this.getRootVaultListForCustomer()));
  }

  /**
   * Retrieves all the locations for the given client for daily summary overview.
   * @returns An observable that emits a collection of IVaultItem.
   */
  public getRootVaultListForCustomer(): Observable<IVaultDirectory> {

    // setup request options
    let options: RequestOptionsArgs = {
      params: <IVaultGetVaultListQueryParams>{
        cid: this.customerService.customerId
      }
    };

    let potentialResult = this.http.get(Config.urls.vaultStructure, options);

    potentialResult.subscribe((result: IVaultDirectory) => {

      // set vault
      this.vault.next(result);

      // set current directory
      this.getFilesForDirectory();
    });

    return potentialResult;
  }

  /**
   * Retreives a shareable link.
   * @param hours Represnts the duration in hours that the link will expire in.
   * @param fileId Represnets the id of the file, currently its url.
   */
  public getSharedLink(hours: number, fileId: string): Observable<IVaultLinkShare> {

    // setup request options
    let options: RequestOptionsArgs = {
      params: <IVaultGetVaultListQueryParams>{
        cid: this.customerService.customerId,
        uri: fileId,
        expirationHours: hours
      }
    };

    return this.http.get(Config.urls.vaultLinkShare, options);
  }

  /**
   * Sets the current directory path.
   * @param id The file surrogate identifier
   */
  public setCurrentDirectory(id: string): void {
    this.currentlySelectedDirectory.next(id || '/');
  }

  /**
   * Searches directories for files using depth-first strategy.
   * @param id The surrogate id of the chosen directory.
   * @param directory The directory structure to parse.
   */
  private searchVaultForDirectory(id: string, directory: Array<IVaultDirectory>): Array<IVaultFile> {
    for (let i = 0; i < directory.length; i++) {

      // get reference to current directory iteration item
      let dirItem = directory[i];

      // get files if the directory was found
      if (dirItem.id === id) {

        // match found, return immediatly
        return dirItem.files;
      }

      // no match and no sub-directories so continue on
      if (dirItem.sub_directories == null || dirItem.sub_directories.length < 1) {
        continue;
      }

      // sub-directorires exist so recursivelly call self in order to scan further directory
      let potentialFiles = this.searchVaultForDirectory(id, dirItem.sub_directories);

      // if nothing was found and no directories exist, move on
      if (potentialFiles === undefined || potentialFiles == null || potentialFiles.length < 1) {
        continue;
      }

      // match found in sub-directories, return immediatly
      return potentialFiles;
    }
  }
}
