import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmGraphComponent } from './alarm-graph.component';

describe('AlarmGraphComponent', () => {
  let component: AlarmGraphComponent;
  let fixture: ComponentFixture<AlarmGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlarmGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
