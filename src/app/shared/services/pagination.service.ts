import { Injectable } from '@angular/core';
import * as _ from 'underscore';

import { IPager } from 'app/shared/models';

@Injectable()
export class PaginationService {

  constructor() { }

  getPager(totalItems: number, currentPage = 1, pageNumber = 10, pageSize = 10): IPager {
    let midPage: number;
    let checkMidPageNumber: boolean;
    let totalPages: number;
    if (pageNumber % 2 === 0) {
      checkMidPageNumber = true;
    } else {
      checkMidPageNumber = false;
    }
    midPage = Math.trunc(pageNumber / 2);

    // calculate total pages
    if (totalItems > 0) {
      totalPages = Math.ceil(totalItems / pageSize);
    }

    let startPage: number, endPage: number;
    if (totalPages <= pageNumber) {
      // less than 10 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // more than 10 total pages so calculate start and end pages
      if (currentPage <= (midPage + 1)) {
        startPage = 1;
        endPage = pageNumber;
      } else if (currentPage + (midPage - 1) >= totalPages) {
        startPage = totalPages - (pageNumber - 1);
        endPage = totalPages;
      } else {
        startPage = currentPage - midPage;
        if (checkMidPageNumber) {
          endPage = currentPage + (midPage - 1);
        } else {
          endPage = currentPage + midPage;
        }
      }
    }

    // calculate start and end item indexes
    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    let pages = _.range(startPage, endPage + 1);

    // return object with all pager properties required by the view
    return <IPager>{
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages
    };
  }
}
