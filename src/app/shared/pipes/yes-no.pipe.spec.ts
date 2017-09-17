/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { YesNoPipe } from './yes-no.pipe';

describe('YesNoPipe', () => {
  it('create an instance', () => {
    let pipe = new YesNoPipe();
    expect(pipe).toBeDefined();
  });

  it('return Yes if input value is true', () => {
    let pipe = new YesNoPipe();
    let result = pipe.transform(true);
    expect(result).toBe('Yes');
  });

  it('return No if input value is false', () => {
    let pipe = new YesNoPipe();
    let result = pipe.transform(false);
    expect(result).toBe('No');
  });
});
