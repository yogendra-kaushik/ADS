import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';

import { IFileView, FileType } from 'app/shared/models';

@Component({
  selector: 'app-file-view',
  templateUrl: './file-view.component.html',
  styleUrls: ['./file-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class FileViewComponent {

  /**
   * Reprsents the title heading.
   */
  public title: string;

  public type: FileType;

  constructor(
    private dialogRef: MdDialogRef<FileViewComponent>,
    @Inject(MD_DIALOG_DATA) private model: IFileView,
    private domSanitizer: DomSanitizer) {

    // get the name by cutting of the tail following the equal sign
    this.title = decodeURI(model.name);

    this.type = model.type;
  }

  public getCleanImgUrl(): SafeUrl {
    return this.domSanitizer.bypassSecurityTrustUrl(this.model.url.toString());
  }

  public getCleaniFrameUrl(): SafeResourceUrl {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(this.model.url.toString())
  }
}
