import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationService } from '../../navigation/navigation.service';
import { Response } from '../../../../node_modules/@angular/http/src/static_response';

@Component({
    templateUrl: './welcome.component.html'  ,
     styleUrls: ['welcome.component.scss']
})
export class WelcomeComponent implements OnInit, OnDestroy {
    constructor(private _navigation: NavigationService) {
    }

    ngOnInit() {
        //Old this._navigation.setSidenavStyle('hidden');
    }

    ngOnDestroy() {
        //Old  this._navigation.setSidenavStyle('side');
    }
}