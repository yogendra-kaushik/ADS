/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PaginationService } from './pagination.service';

describe('PaginationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaginationService]
    });
  });

  it('should create instance of PaginationService...', inject([PaginationService], (service: PaginationService) => {
    expect(service).toBeTruthy();
  }));
});
