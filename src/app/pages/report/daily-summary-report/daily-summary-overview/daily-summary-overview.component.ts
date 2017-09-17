import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { IDailySummaryReport, IReportRecord } from 'app/shared/models';

import { DailySummaryReportService } from '../daily-summary-report.service';
import { Config, CustomerService, LocationGroupService, PreLoaderService } from 'app/shared/services';

@Component({
  selector: 'app-daily-summary-overview',
  templateUrl: './daily-summary-overview.component.html',
  styleUrls: ['./daily-summary-overview.component.scss']
})
export class DailySummaryOverviewComponent implements OnInit, OnDestroy {

  /**
   * Represents the daily summary table representation.
   */
  public dailySummaryData: IDailySummaryReport;

  private customerOrLocationChange = new Array<Subscription>();

  private fullData: IDailySummaryReport;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private preloaderService: PreLoaderService,
    private reportService: DailySummaryReportService,
    private customerService: CustomerService,
    private locationGroupService: LocationGroupService) { }

  public ngOnInit() {

    this.setupDailySummaryView();

    this.onCustomerChange();
  }

  public ngOnDestroy() {

    this.customerOrLocationChange.forEach((s: Subscription) => s.unsubscribe());
  }

  public showPageRecords(items: IReportRecord): void {
    this.dailySummaryData = items;
  }

  private itemSelected(event: MouseEvent, id: number): void {

    // navigate to details route
    this.router.navigate(['../', id, 'details'], { relativeTo: this.activatedRoute });
  }

  /**
   * Handles setup of data from route upon first load.
   */
  private setupDailySummaryView() {

    // grab daily summary report from route data
    let result = this.activatedRoute.snapshot.data['daily-summary-overview'];

    this.fullData = result;

    this.fillDailySummaryData(result);
  }

  private fillDailySummaryData(summaryData: IDailySummaryReport): void {
    this.dailySummaryData = <IDailySummaryReport>{
      headers: summaryData.headers,
      data: summaryData.data.slice(0, 10)
    };
  }

  /**
   * Handles setup of data upon customer change.
   */
  private onCustomerChange(): void {

    // merge both customer and location group change observables and act upon them
    let customerChange = Observable.merge(this.customerService.customerChange, this.locationGroupService.locationGroupChange);

    // subscribe to customer change Observable
    let customerChangeSubscription = customerChange.subscribe((customerId: number) => {

      // initate the preloader
      this.preloaderService.start();

      // retrieve data from customer
      this.reportService.getDailySummaryReport().subscribe((result: IDailySummaryReport) => {
        this.fullData = result;

        this.fillDailySummaryData(result);

        this.preloaderService.stop();
      });
    });

    this.customerOrLocationChange.push(customerChangeSubscription);
  }
}
