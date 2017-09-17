import { TestBed, inject } from '@angular/core/testing';

import { VaultDashboardResolverService } from './vault-dashboard-resolver.service';

describe('VaultFileListResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VaultDashboardResolverService]
    });
  });

  it('should be created', inject([VaultDashboardResolverService], (service: VaultDashboardResolverService) => {
    expect(service).toBeTruthy();
  }));
});
