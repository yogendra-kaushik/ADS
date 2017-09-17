import { Component, HostBinding, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { IDailySummaryLocationDetail } from '../../../../shared/models';

@Component({
  selector: 'app-daily-summary-details',
  templateUrl: './daily-summary-details.component.html',
  styleUrls: ['./daily-summary-details.component.scss']
})
export class DailySummaryDetailsComponent implements OnInit {

  /**
   * Represents the daily summary table representation.
   */
  public dailySummaryData: IDailySummaryLocationDetail;

  constructor(private activatedRoute: ActivatedRoute, private router: Router) { }

  public ngOnInit() {
    this.dailySummaryData = this.activatedRoute.snapshot.data['daily-summary-details'];
  }

  itemSelected(event: Event, id: number) {
    console.log('Location "%s" selected.', id);
  }

}
