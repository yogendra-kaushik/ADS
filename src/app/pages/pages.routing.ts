import { RouterModule } from '@angular/router';

import { VaultDashboardComponent, VaultDashboardResolverService } from './vault';

export const pagesRouting = RouterModule.forChild([
  {
    path: 'vault',
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      { path: 'list', component: VaultDashboardComponent, resolve: { 'root-vault': VaultDashboardResolverService } }
    ]
  }
]);
