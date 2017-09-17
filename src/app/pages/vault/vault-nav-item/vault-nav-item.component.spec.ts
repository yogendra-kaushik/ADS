import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VaultNavItemComponent } from './vault-nav-item.component';

describe('VaultNavItemComponent', () => {
  let component: VaultNavItemComponent;
  let fixture: ComponentFixture<VaultNavItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VaultNavItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VaultNavItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
