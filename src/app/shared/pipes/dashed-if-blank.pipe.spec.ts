/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { DashedIfBlankPipe } from './dashed-if-blank.pipe';

describe('DashedIfBlankPipe', () => {
   it('create an instance', () => {
    let pipe = new DashedIfBlankPipe();
    expect(pipe).toBeDefined();
  });

  it('return -- if input value is empty/ blank', () => {
    let pipe = new DashedIfBlankPipe();
    let result = pipe.transform('');
    expect(result).toBe('--');
  });

  it('return same value if input value is not empty/ blank', () => {
    let pipe = new DashedIfBlankPipe();
    let result = pipe.transform('testresult');
    expect(result).toBe('testresult');
  });
});
