import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Resolve } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { VaultService } from '../vault.service';
import { IVaultDirectory } from '../../../shared/models';

@Injectable()
export class VaultDashboardResolverService implements Resolve<Observable<IVaultDirectory>> {
  constructor(private vaultService: VaultService) { }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IVaultDirectory> {
    return this.vaultService.getRootVaultListForCustomer();
  }
}
