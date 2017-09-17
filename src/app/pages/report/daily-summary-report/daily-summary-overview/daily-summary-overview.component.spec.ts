import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailySummaryOverviewComponent } from './daily-summary-overview.component';

describe('DailySummaryOverviewComponent', () => {
  let component: DailySummaryOverviewComponent;
  let fixture: ComponentFixture<DailySummaryOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailySummaryOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailySummaryOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
