import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'extension'
})
export class FileExtensionPipe implements PipeTransform {

  private readonly empty = '-';

  transform(value: string): string {

    // ensure args
    if (value === undefined || value === '') {
      return this.empty;
    }

    return this.getFileExtension(value);
  }

  /**
  * Retrieves the extension as a string of a given filename.
  * @param fileName The file name from which to retrieve the extension.
  * @returns the extension of the file as a string.
  */
  private getFileExtension(fileName: string): string {

    // get segments of file name
    let fileSegments = fileName.split('.');

    // ensure that there is more segments than just one which will indicate that the file name has no extension
    if (fileSegments.length < 2) {
      return '-';
    }

    // get the last segment which will be the extension
    let potentialExtension = fileSegments.pop();

    // set extension and return
    return potentialExtension === '' ? '-' : potentialExtension;
  }
}
