import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

    transform(value: any | any[], expression?: any, reverse?: boolean): any {
        if (!value) {
            return value;
        }

        const isArray = value instanceof Array;

        if (isArray) {
            return this.sortArray(value, expression, reverse);
        }

        return value;
    }

    /**
     * Sort array
     *
     * @param value
     * @param expression
     * @param reverse
     * @returns {any[]}
     */
    private sortArray(value: any[], expression?: any, reverse?: boolean): any[] {
        let array: any[] = value.sort((a: any, b: any): number => {
            if (!expression) {
                return a > b ? 1 : -1;
            }
            if (typeof (a[expression]) === 'string' && typeof (b[expression]) === 'string') {
                return a[expression].toUpperCase() > b[expression].toUpperCase() ? 1 : -1;
            } else {
                return a[expression] > b[expression] ? 1 : -1;
            }
        });

        if (reverse) {
            return array.reverse();
        }

        return array;
    }
}