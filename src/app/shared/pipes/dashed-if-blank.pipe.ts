import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dashedIfBlank'
})
export class DashedIfBlankPipe implements PipeTransform {

  transform(value: any): string {
    if (!value || value.length === 0) { return '--'; }
    return value;
  }

}
