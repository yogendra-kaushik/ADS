import { MenuItem } from './menu-item';
import { NavigationService } from './navigation.service';
import { SidenavItemComponent } from './sidenav/sidenav-item/sidenav-item.component';
import { environment } from '../../app/environments/environment.dev';

export const menuItemSetup: MenuItem[] =
  environment.showOnlyCrowdcore === true ?

    [new MenuItem({ title: 'CrowdCore', link: '/crowdcore', icon: 'poll' })]
    :
    [
      new MenuItem({ title: 'HOME', link: '/home', icon: 'home' }),
      new MenuItem({ title: 'LOCATION DASHBOARD', link: '/viewData', icon: 'place' }),
      new MenuItem({ title: 'VAULT', link: '/pages/vault/list', icon: 'folder' }),
      new MenuItem('REPORT', null, [
        new MenuItem({ title: 'DAILY SUMMARY', link: '/pages/report', icon: '' })
      ], null, null, 'description')
    ];
