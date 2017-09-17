import { Component, ChangeDetectorRef, Inject, OnInit, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';

import { ITelemetryImportDatum } from 'app/shared/models';

@Component({
  selector: 'app-vault-telemetry-import',
  templateUrl: './vault-telemetry-import.component.html',
  styleUrls: ['./vault-telemetry-import.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class VaultTelemetryImportComponent implements OnInit {

  public telemetryData: ITelemetryImportDatum;

  public isRequestImport: boolean;

  constructor(
    private dialogRef: MdDialogRef<VaultTelemetryImportComponent>,
    @Inject(MD_DIALOG_DATA) private dialogData: ITelemetryImportDatum,

    private changeDetector: ChangeDetectorRef
  ) { }

  /**
   * Framework level licecycle hook.
   */
  public ngOnInit(): void {
    this.telemetryData = this.dialogData;

    // TODO: remove dummy data
    this.telemetryData = <ITelemetryImportDatum>{
      id: 'my-sample_file.csv',
      import: {
        locations: [
          { name: 'Gotham City' },
          { name: 'Metropolis' },
          { name: 'New York City' },
          { name: 'Gotham City' },
          { name: 'Metropolis' },
          { name: 'New York City' },
          { name: 'Gotham City' },
          { name: 'Metropolis' },
          { name: 'New York City' },
        ],
        dateRange: '03/01/2017 - 03/31/2017'
      }
    }

    this.changeDetector.detectChanges();
  }

  /**
   * Handles the request for import click event which will initiate the warning message.
   * @param event Represents the mouse event.
   */
  public requestImportDataHandler(event: MouseEvent): void {

    // set state of import request
    this.isRequestImport = true;
  }

  /**
   * Handles the actual importing of the file.
   * @param event Represents the mouse event.
   */
  public handleImport(event: MouseEvent): void {
    console.log('importing');
  }
}
