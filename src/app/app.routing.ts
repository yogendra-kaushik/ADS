import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { AuthGuard } from './shared/services/auth-guard.service';
import { WelcomeComponent } from './public/welcome/welcome.component';
import { QstartComponent } from './pages/qstart/qstart.component';
import { SubmissionsComponent } from './pages/submissions/submissions.component';
import { environment } from './environments/environment';
import { AutoScrubSummaryComponent } from './pages/auto-scrub-summary/auto-scrub-summary.component';
import { LocationDashboardComponent } from './locationdashboard/location-dashboard.component';
import { ViewDataComponent } from 'app/pages/view-data/view-data.component';

const appRoutes: Routes = environment.showOnlyCrowdcore === true ?
  [
    { path: 'welcome', component: WelcomeComponent }
  ]
  :
  [
    { path: 'home', component: LocationDashboardComponent, canActivate: [AuthGuard] },
    { path: 'pages', canActivate: [AuthGuard], loadChildren: './pages/pages.module#PagesModule' },
    { path: 'welcome', component: WelcomeComponent },
    { path: 'autoreviewsummary', component: AutoScrubSummaryComponent, canActivate: [AuthGuard] },
    { path: 'viewData', component: ViewDataComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '/home' }
  ];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
