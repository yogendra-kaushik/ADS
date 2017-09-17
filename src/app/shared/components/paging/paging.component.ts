import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { PaginationService } from '../../../shared/services/pagination.service';

import { IPager, IReportRecord } from 'app/shared/models';

/**
 * Represnets a client side implementation of a paginator. This paginator grabs
 * the entire data set returned from the API and will paginate in memory.
 * An addition was made to it to support report components. If paginating reports
 * fill the "reportRecords" object instead of the "totalRecords" object.
 */
@Component({
  selector: 'ads-paging',
  templateUrl: './paging.component.html',
  styleUrls: ['./paging.component.scss'],
  providers: [PaginationService]
})
export class PagingComponent implements OnInit, OnChanges {

  /**
   * The data set to be paginated.
   */
  @Input() public totalRecords: Array<any>;

  /**
   * The report data set to be paginated
   */
  @Input() public reportRecords: IReportRecord;

  /**
   * Indicates whether to have the paginator default to the first page
   * if the value is set to true, paginator will use current page instead.
   */
  @Input() public setFirstPage: boolean;

  /**
   * Indicates how many pages to display; the service defaults to 10.
   */
  @Input() public pageNumber: number;

  /**
   * Triggers parent component to showpaged records
   */
  @Output() public showPageRecords = new EventEmitter<Array<any>>();

  /**
   * Represents emitter for a report.
   */
  @Output() public showReportPageRecords = new EventEmitter<IReportRecord>();

  /**
   * The pager object used to maintain a sense of the in-memory paging state.
   */
  public pager = <IPager>{};

  constructor(private paginationService: PaginationService) { }

  /**
   * Framework level lifecycle hook.
   */
  public ngOnInit() {
    this.setPage(1);
  }

  /**
   * Used to detect changes to pagination change for when customer/location is updated.
   */
  public ngOnChanges() {

    // if pages are not set, default to first page
    if (this.pager.currentPage === undefined || this.setFirstPage === true) {
      return this.setPage(1);
    }

    // set current page
    this.setPage(this.pager.currentPage);
  }

  /**
   * Sets the current page and emits the results.
   * @param page Represents the page number to set to the current state.
   */
  public setPage(page: number) {

    // ensure valid arguments
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }

    // check if report records were passed in, if so this is a report
    // so proces it as such.
    if (this.reportRecords !== undefined && this.reportRecords != null) {
      return this.setReportPage(page);
    }

    // determine if thre are any records
    if (this.totalRecords === undefined || this.totalRecords === null) {
      return;
    }

    // get pager object from service
    this.pager = this.paginationService.getPager(this.totalRecords.length, page, this.pageNumber);

    // get current page of items
    let result = this.totalRecords.slice(this.pager.startIndex, this.pager.endIndex + 1);

    // emit result to parent
    this.showPageRecords.emit(result);
  }

  /**
   * Sets the current reports page and emits the results.
   * @param page Represents the page number to set to the current state.

   */
  public setReportPage(page: number): void {

    // get pager object from service
    this.pager = this.paginationService.getPager(this.reportRecords.data.length, page, this.pageNumber);

    // get current page of items
    let result = <IReportRecord>{
      headers: this.reportRecords.headers,
      data: this.reportRecords.data.slice(this.pager.startIndex, this.pager.endIndex + 1)
    };

    // emit results to parent
    this.showReportPageRecords.emit(result);
  }
}
