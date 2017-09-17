import { Injectable } from '@angular/core';

/**
 * Responsible for handling operations on files and file types.
 */
@Injectable()
export class FileService {

  /**
   * Represents common browser supported image file types.
   */
  private commonImageEtensions = ['bmp', 'ico', 'gif', 'jpg', 'jpeg', 'png', 'svg', 'tiff'];

  /**
   * Represents common browser supported text file types.
   */
  private commonTextExtensions = ['txt', 'csv'];

  /**
   * Determines if the passed in file extension is an image file type.
   * @param extension Represents a file extension.
   */
  public isImageExtension(extension: string): boolean {
    return this.checkExtension(extension, this.commonImageEtensions);
  }

  /**
   * Determines if the passed in file extension is a text type.
   * @param extension Represents the file extension to be checked.
   */
  public isTextExtension(extension: string): boolean {
    return this.checkExtension(extension, this.commonTextExtensions);
  }

  public getFileNameFromURL(url: URL): string {
    return url.search.split('=').pop();
  }

  /**
   * Determine if the file extensions collection contains the target file extension.
   * @param target Represents the target file extension to be checked.
   * @param extensions Represents the file extensions collection that the target will be checked against.
   */
  private checkExtension(target: string, extensions: Array<string>): boolean {
    return extensions.some((extension: string) => extension === target);
  }
}
