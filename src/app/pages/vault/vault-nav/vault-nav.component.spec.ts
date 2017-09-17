import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VaultNavComponent } from './vault-nav.component';

describe('VaultNavComponent', () => {
  let component: VaultNavComponent;
  let fixture: ComponentFixture<VaultNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VaultNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VaultNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
