import { TestBed, async } from '@angular/core/testing';
import { Customer } from './customer';

describe('customer', () => {
  it('create an instance', () => {
    let customer = new Customer();
    expect(customer).toBeDefined();
  });
});
