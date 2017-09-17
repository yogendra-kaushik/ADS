import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VaultItemShareComponent } from './vault-item-share.component';

describe('VaultItemShareComponent', () => {
  let component: VaultItemShareComponent;
  let fixture: ComponentFixture<VaultItemShareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VaultItemShareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VaultItemShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
