import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from '@angular/material';

import { CalloutComponent } from './layout/callout/callout.component';
import { WidgetComponent } from './layout/widget/widget.component';
import { ChipComponent } from './layout/chip/chip.component';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { environment } from '../environments/environment';
import { DashedIfBlankPipe, YesNoPipe } from './pipes';
import { SortingDirective } from './directive/sorting.directive';
import { ColorService, FileService, PreLoaderService } from './services';

import {
  ClusterLocationsComponent,
  ConfirmDialog,
  ConfirmationDialogComponent,
  CustomMap,
  GeneralComponent,
  FileViewComponent,
  MapComponent,
  MarkerLocationDetailsComponent,
  PagingComponent
} from './components';
import { LoaderComponent } from 'app/shared/components/loader/loader.component';

@NgModule({
  declarations: [
    CalloutComponent,
    ChipComponent,
    ClusterLocationsComponent,
    ConfirmDialog,
    ConfirmationDialogComponent,
    CustomMap,
    DashedIfBlankPipe,
    GeneralComponent,
    MapComponent,
    MarkerLocationDetailsComponent,
    PagingComponent,
    SortingDirective,
    WidgetComponent,
    YesNoPipe,
    LoaderComponent,
    FileViewComponent
  ],
  exports: [
    MapComponent,
    MarkerLocationDetailsComponent,
    CustomMap,
    PagingComponent,
    LoaderComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    MaterialModule,
    AgmCoreModule.forRoot({
      apiKey: environment.mapApiKey // Enter your key here!
    })],
  entryComponents: [
    ConfirmDialog,
    ConfirmationDialogComponent,
    FileViewComponent
  ],
  providers: [
    PreLoaderService,
    FileService
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [ColorService]
    };
  }
}
