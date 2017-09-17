import { Component, Input, OnInit, OnDestroy, QueryList } from '@angular/core';
import { NavigationService } from '../navigation.service';
import { MenuItem } from '../menu-item';
import { SidenavItemComponent } from './sidenav-item/sidenav-item.component';
import { ViewChildren } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit, OnDestroy {
  @ViewChildren(SidenavItemComponent) children: QueryList<SidenavItemComponent>;
  @Input() isHovering = false;

  sidenavStyle: string;
  menuItemsObservable: Observable<MenuItem[]>;
  private menuItems: MenuItem[] = [];
  private _screenWidth: number = NavigationService.largeViewportWidth;
  private _initialLoad = true; // Used to show slide in effect on page load for sidenav
  private _this: SidenavComponent = this;
  private _subscriptions: Subscription[] = [];

  constructor(public navigation: NavigationService) {
  }

  ngOnDestroy() {
    this._subscriptions.forEach(sub => {
      sub.unsubscribe();
    })
  }

  ngOnInit() {
    this._subscriptions.push(this.navigation.sidenavOpened.subscribe(opened => {
      if (this.navigation.largeScreen) {
        if (opened) {
          this.navigation.openSidenavStyle.take(1).subscribe(style => {
            this.sidenavStyle = style;
          });
        } else {
          this.navigation.closedSidenavStyle.take(1).subscribe(style => {
            this.sidenavStyle = style;
          });
        }
      } else {
        this.sidenavStyle = 'over';
      }
    }));
    this.menuItemsObservable = Observable
      .combineLatest(this.navigation.menuItems, this.navigation.tempMenuItems, (menuItems, tempMenuItems) => {
        if (tempMenuItems !== null && tempMenuItems.length > 0) {
          return tempMenuItems;
        }
        return menuItems;
      });
    this._subscriptions.push(this.menuItemsObservable.subscribe(menuItems => {
      this.menuItems = menuItems;
    }));
  }

  get height(): number {
    let addedHeight = 0;
    if (this.children) {
      this.children.forEach(childComponent => {
        if (childComponent.active) {
          addedHeight += childComponent.height;
        }
      });
    }
    return (this.menuItems.length * 48) + addedHeight;
  }

  toggle(active: boolean, child: SidenavItemComponent) {
    if (this.children) {
      this.children.forEach(childComponent => {
        if (child !== childComponent) {
          childComponent.toggle(false, undefined, true);
        }
      });
    }
  }
}
