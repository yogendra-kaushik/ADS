import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistanceCenterComponent } from './assistance-center.component';

describe('AssistanceCenterComponent', () => {
  let component: AssistanceCenterComponent;
  let fixture: ComponentFixture<AssistanceCenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistanceCenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistanceCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
