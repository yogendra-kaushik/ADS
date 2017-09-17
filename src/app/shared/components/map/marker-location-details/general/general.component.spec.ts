/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { GeneralComponent } from './general.component';
import { YesNoPipe } from '../../../../pipes/yes-no.pipe';
import { DashedIfBlankPipe } from '../../../../pipes/dashed-if-blank.pipe';
import { MapService } from '../../../../services/map.service';

describe('GeneralComponent', () => {
  let component: GeneralComponent;
  let fixture: ComponentFixture<GeneralComponent>;

  it('test statusEdit value', () => {
    let _mapService: MapService;
    // tslint:disable-next-line:no-shadowed-variable
    let component = new GeneralComponent(_mapService);
    expect(component.statusEdit).toBeFalsy();
  });
});
