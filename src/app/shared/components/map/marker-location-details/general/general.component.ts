import { Component, OnInit, Input, Pipe } from '@angular/core';
import { LocationDetails } from '../../../../models/location-details';
import { DashedIfBlankPipe } from '../../../../pipes/dashed-if-blank.pipe';
import { MapService } from '../../../../services/map.service';
import { Config } from '../../../../services/config';
import { User } from '../../../../models/user';

@Component({
  selector: 'marker-location-details-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
  providers: [MapService, Config]

})
export class GeneralComponent implements OnInit {

  statusEdit: boolean;
  @Input() locationDetails: LocationDetails;

  constructor(private _mapService: MapService) {
    this.statusEdit = false;
  }

  ngOnInit() {
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges() {
  }

/*
  editGeneralTab() {
    if (this.statusEdit) {
      let temp1: User = Config.user;
      this._mapService.saveMarkerLocationDetailsForGeneral(1, 2, this.locationDetails);
    }
    else
      this.statusEdit = true;
  }

  cancelEditGeneralTab() {
    this.statusEdit = false;
  }
*/

}
