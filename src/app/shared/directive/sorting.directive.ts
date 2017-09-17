import { Directive, Input } from '@angular/core';

@Directive({
  selector: 'ads-sorting'
})
export class SortingDirective {
  sortingCriteria: any;
  config: string;
  @Input() pagedItems: any[];
  @Input() componentName: any[];

  constructor() {
    this.init();
  }

  init() {
    this.sortingCriteria = {
      column: 'locationName',  // default sorting column.
      descending: true
    };

    this.config = this.sortingCriteria.descending ? '-' + this.sortingCriteria.column : this.sortingCriteria.column;
    this.sorting();
  }

  _orderByComparator(a: any, b: any): number {
    if (a === null || typeof a === 'undefined') {
      a = 0;
    }
    if (b === null || typeof b === 'undefined') {
      b = 0;
    }

    if ((isNaN(parseFloat(a)) || !isFinite(a)) || (isNaN(parseFloat(b)) || !isFinite(b))) {
      // Isn't a number so lowercase the string to properly compare
      if (a.toLowerCase() < b.toLowerCase()) {
        return -1;
      }
      if (a.toLowerCase() > b.toLowerCase()) {
        return 1;
      }
    } else {
      // Parse strings as numbers to compare properly
      if (parseFloat(a) < parseFloat(b)) {
        return -1;
      }
      if (parseFloat(a) > parseFloat(b)) {
        return 1;
      }
    }

    return 0; //equal each other
  }

  changeSorting(columnName): void {
    let sort = this.sortingCriteria;
    if (sort.column === columnName) {
      sort.descending = !sort.descending;
    } else {
      sort.column = columnName;
      sort.descending = false;
    }
    this.config = this.sortingCriteria.descending ? '-' + this.sortingCriteria.column : this.sortingCriteria.column;
    this.sorting();
  }

  sorting() {
    if (this.pagedItems !== undefined) {
      // make a copy of the input's reference
      this.pagedItems = [...this.pagedItems];
      let value = this.pagedItems;

      if (!Array.isArray(value)) {
        return value;
      }

      if (!Array.isArray(this.config) || (Array.isArray(this.config) && this.config.length === 1)) {
        let propertyToCheck: string = !Array.isArray(this.config) ? this.config : this.config[0];
        let desc = propertyToCheck.substr(0, 1) === '-';

        // Basic array
        if (!propertyToCheck || propertyToCheck === '-' || propertyToCheck === '+') {
          value = !desc ? value.sort() : value.sort().reverse();
        } else {
          let property: string = propertyToCheck.substr(0, 1) === '+' || propertyToCheck.substr(0, 1) === '-'
            ? propertyToCheck.substr(1)
            : propertyToCheck;

          value = value.sort(function (a: any, b: any) {
            return !desc
              ? this.componentName._orderByComparator(a[property], b[property])
              : -this.componentName._orderByComparator(a[property], b[property]);
          });
        }
        this.pagedItems = value;
      } else {
        // Loop over property of the array in order and sort
        value = value.sort(function (a: any, b: any) {
          for (let i: number = 0; i < this.config.length; i++) {
            let desc = this.config[i].substr(0, 1) === '-';
            let property = this.config[i].substr(0, 1) === '+' || this.config[i].substr(0, 1) === '-'
              ? this.config[i].substr(1)
              : this.config[i];

            let comparison = !desc
              ? this.componentName._orderByComparator(a[property], b[property])
              : -this.componentName._orderByComparator(a[property], b[property]);

            // Don't return 0 yet in case of needing to sort by next property
            if (comparison !== 0) {
              return comparison;
            }
          }
          return 0; // equal each other
        });
        this.pagedItems = value;
      }
    }
  }

}
