import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { IVaultDirectory } from 'app/shared/models';
import { VaultService } from '../vault.service';

@Component({
  selector: 'app-vault-nav',
  templateUrl: './vault-nav.component.html',
  styleUrls: ['./vault-nav.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VaultNavComponent implements OnDestroy, OnInit {

  /**
   * Represents the colleciton of files and folders.
   */
  @Input() vault: IVaultDirectory;

  /**
   * Repreents a value indicating whether the root directory is selected..
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
    this.subscriptions.push(this.vaultService.CurrentDirectory.subscribe((id: string) => this.isActive = id === '/'));
  }

  public selectRootFolder(): void {
    this.vaultService.getFilesForDirectory('/');
  }
}
