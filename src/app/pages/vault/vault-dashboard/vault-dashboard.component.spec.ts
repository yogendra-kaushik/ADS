import { EventEmitter } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import {
  MaterialModule,
  MdDialogModule,
  MdListModule,
  MdButtonToggleModule,
  MdIconModule,
  MdSidenavModule,
  MdDialog
} from '@angular/material';

import { BehaviorSubject, Observable } from 'rxjs';

import { VaultNavItemComponent } from '../vault-nav-item/vault-nav-item.component';
import { VaultDashboardComponent } from './vault-dashboard.component';
import { VaultNavComponent } from '../vault-nav/vault-nav.component';
import { VaultItemComponent } from '../vault-item/vault-item.component';
import { VaultService } from '../vault.service';
import { FileExtensionPipe } from 'app/shared/pipes';
import { NavigationService } from 'app/navigation/navigation.service';
import { CustomerService, PreLoaderService } from 'app/shared/services';

describe('VaultDashboardComponent', () => {
  let component: VaultDashboardComponent;
  let fixture: ComponentFixture<VaultDashboardComponent>;
  let vaultService: FakeVaultService;
  let vaultService_getFilesForDirectory: jasmine.Spy;
  let vaultService_CurrentDirectory: jasmine.Spy;
  let customerService: CustomerService;
  let customerSerivce_customerIdProp: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        VaultNavComponent,
        VaultDashboardComponent,
        VaultNavItemComponent,
        VaultItemComponent,
        FileExtensionPipe
      ],
      imports: [
        MaterialModule,
        MdDialogModule,
        MdListModule,
        MdButtonToggleModule,
        MdIconModule,
        MdSidenavModule
      ],
      providers: [
        { provide: VaultService, useClass: FakeVaultService },
        { provide: PreLoaderService, useClass: FakePreLoaderService },
        { provide: CustomerService, useClass: FakeCustomerService },
        { provide: NavigationService, useClass: FakeNavigationService },
        { provide: MdDialog, useClass: MdDialogStub }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VaultDashboardComponent);

    component = fixture.componentInstance;

    customerService = fixture.debugElement.injector.get(CustomerService);
    customerSerivce_customerIdProp = spyOnProperty(customerService, 'customerId', 'get');

    vaultService = fixture.debugElement.injector.get(VaultService);
    vaultService_getFilesForDirectory = spyOn(vaultService, 'getFilesForDirectory');
    vaultService_CurrentDirectory = spyOn(vaultService, 'CurrentDirectory');

    // spyOnProperty()

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should set current selected customer id on startup', fakeAsync(() => {
    expect(customerSerivce_customerIdProp.calls.any()).toBeTruthy();
  }));

  xit ('should set current selected directory id on startup', fakeAsync(() => {
    expect(vaultService_CurrentDirectory.calls.any()).toBeTruthy();
  }));

  it('should invoke service to select directory', fakeAsync(() => {

    component.directorySelected('no id passed in');

    expect(vaultService_getFilesForDirectory.calls.any()).toBeTruthy();
  }));

});

class MdDialogStub { }

class FakeVaultService {
  get CurrentDirectory() { return new BehaviorSubject<string>('/'); }
  getFilesForDirectory() { };
}

class FakePreLoaderService { }
class FakeCustomerService {
  get customerId() { return 0 };
  customerChange = new EventEmitter<number>();
}
class FakeNavigationService {
  setSidenavOpened() { }
}
