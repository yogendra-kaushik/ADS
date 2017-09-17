import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'SearchLocationNamePipe'
})

export class SearchLocationNamePipe implements PipeTransform {
    transform(items: any[], field: string, value: string): any[] {
        if (!value || value == '') {
            return items;
        }
        if (!items) return [];

        return items.filter(it => it[field].toLowerCase().startsWith(value.toLowerCase()));
    }

}