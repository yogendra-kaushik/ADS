import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VaultTelemetryImportComponent } from './vault-telemetry-import.component';

describe('VaultTelemetryImportComponent', () => {
  let component: VaultTelemetryImportComponent;
  let fixture: ComponentFixture<VaultTelemetryImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VaultTelemetryImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VaultTelemetryImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
