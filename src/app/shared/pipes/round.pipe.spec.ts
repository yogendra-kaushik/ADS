/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { RoundPipe } from './round.pipe';

describe('RoundPipe', () => {

  it('create an instance', () => {
    const pipe = new RoundPipe();
    expect(pipe).toBeTruthy();
  });

  it('return round off greater value if input value is greate then .96', () => {
    let pipe = new RoundPipe();
    let result = pipe.transform(1.98);
    expect(result).toBe(198);
  });

  it('return round off small value if input value is less then .20', () => {
    let pipe = new RoundPipe();
    let result = pipe.transform(1.20);
    expect(result).toBe(120);
  });
});
