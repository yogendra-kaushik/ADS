import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VaultItemComponent } from './vault-item.component';

describe('VaultItemComponent', () => {
  let component: VaultItemComponent;
  let fixture: ComponentFixture<VaultItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VaultItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VaultItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
