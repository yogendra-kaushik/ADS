import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailySummaryDetailsComponent } from './daily-summary-details.component';

describe('DailySummaryDetailsComponent', () => {
  let component: DailySummaryDetailsComponent;
  let fixture: ComponentFixture<DailySummaryDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailySummaryDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailySummaryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
