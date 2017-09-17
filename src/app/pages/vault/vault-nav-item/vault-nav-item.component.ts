import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { IVaultDirectory } from 'app/shared/models';
import { VaultService } from '../vault.service';

@Component({
  selector: 'app-vault-nav-item',
  templateUrl: './vault-nav-item.component.html',
  styleUrls: ['./vault-nav-item.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VaultNavItemComponent implements OnDestroy, OnInit {

  /**
   * Represents the collection of directories.
   */
  @Input() public directory: IVaultDirectory;

  /**
   * Repreents a value indicating whether the current item is actively selected as the current directory.
   */
  public isActive: boolean;

  private subscriptions = new Array<Subscription>();

  constructor(private vaultService: VaultService) { }

  /**
   * Lifecycle hook that is called when a directive, pipe or service is destroyed.
   */
  public ngOnDestroy() {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   */
  public ngOnInit() {
    this.subscriptions.push(this.vaultService.CurrentDirectory.subscribe((id: string) => this.isActive = this.directory.id === id));
  }

  /**
   * Handles the response for the click event of the selected directory.
   * @param id Represents the surrogate id of the selected diretory.
   */
  public selectDirectory(id: string): void {
    this.vaultService.getFilesForDirectory(id);
  }
}
