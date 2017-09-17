import { Component, OnInit, Input, OnChanges, NgZone, ChangeDetectorRef } from '@angular/core';
import { SebmGoogleMap, SebmGoogleMapMarker, MapTypeStyle, MarkerManager } from 'angular2-google-maps/core';
import { Observable } from 'rxjs/Observable';
import { MapView } from '../../models/map-view';
import { MapType } from '../../models/map-type';
import { Locations } from '../../models/locations';
import { MarkerLocation } from '../../models/marker-location';
import { PermissionType } from '../../models/permission-type';
import { Coordinate } from '../../models/Coordinate';
import { Config } from '../../services/config';
import { SaveView } from '../../models/save-view';
import { Customer } from '../../models/customer';
import { MdDialogRef, MdDialog, MdDialogConfig } from '@angular/material';
import { CustomerService } from '../../services/customer.service';
import { MapService } from '../../services/map.service';
import { MarkerLocationDetailsComponent } from './marker-location-details/marker-location-details.component';
import { LocationDetails } from '../../models/location-details';
import { ClusterLocationsComponent } from './cluster-locations/cluster-locations.component';
import { AddLocationComponent } from 'app/shared/components/map/add-location/add-location.component';
import { LocationService } from 'app/shared/services/location.service';
import { LocationDashboardService } from 'app/shared/services';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ads-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  providers: [LocationDashboardService, MapService, Config]
})

export class MapComponent implements OnInit, OnChanges {
  @Input() customerId;
  @Input() mapViews: MapView[] = [];
  @Input() mapTypes: MapType[] = [];
  @Input() locations: Locations[] = [];
  mapViewModel: MapView = new MapView(null);
  mapTypeModel: MapType = new MapType(null);
  selectedMapViewId: Number;
  selectedMapTypeId: Number;
  markers: Locations[] = [];
  featureType: string;
  showLegend: boolean;
  permissionType: PermissionType;
  alarmRead: boolean;
  showSaveView: boolean;
  mapAdmin: boolean;
  mapEdit: boolean;
  // Added for ShowView.
  public viewTitle: string;
  public viewButtonTitle: string;
  public message: string;
  public viewName: string;
  public viewDescription: string;
  public latitude: number;
  public longitude: number;
  public zoomVal: number;
  public isViewUpdate: boolean;
  public isDefaultMap: boolean;
  customers: Customer[] = [];
  mapsaveView: SaveView = new SaveView();
  showLocationDetail: boolean = true;
  showLocations: boolean;
  locationDetails: LocationDetails = new LocationDetails();
  clusterLocations: Locations;
  refreshMap: boolean = true;
  inActiveLocationViewFlag: boolean;
  customerDetails: Customer[] = [];
  drawLocationList: Locations[] = [];

  constructor(private customerService: CustomerService,
    private _mapService: MapService,
    private hangeDetectorRef: ChangeDetectorRef, private zone: NgZone, private _dialog: MdDialog,
    private locationService: LocationService,
    private locationDashboardService: LocationDashboardService) {
    this.locationService.locationChange.subscribe(x => this.onLocationChange(x));
  }

  ngOnInit() {
    // this.selectedMapViewId = 1;
    this.selectedMapTypeId = 2;
    this.mapViewModel.zoom = 8;
    this.showLegend = true;
    this.showSaveView = true;
    this.isViewUpdate = false;
    this.isDefaultMap = true;
    this.showLocationDetail = true;
    this.showLocations = true;
  }

  loadRefreshMap() {
    this.locationDashboardService.getLocations(this.customerService.customerId).subscribe(
      res => {
        this.markers = res;
      });
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges() {
    this.showLocations = true;
    this.showLocationDetail = true;
    if (this.mapTypes.length > 0) {
      // tslint:disable-next-line:triple-equals
      this.mapTypeModel = <MapType>this.mapTypes.find(maptype => maptype.id == this.selectedMapTypeId);
      if (this.inActiveLocationViewFlag) {
        this.drawLocationList = this.locations;
      } else {
        if (this.locations !== undefined && this.locations.length > 0) {
          this.drawLocationList = this.locations.filter(x => x.isActiveLocation);
        }
      }
      this.drawMarkers();
    }
  }

  changeMapView() {
    // tslint:disable-next-line:triple-equals
    this.mapViewModel = <MapView>this.mapViews.find(mapview => mapview.id == this.selectedMapViewId);
  }

  changeMapType() {
    // tslint:disable-next-line:triple-equals
    this.mapTypeModel = <MapType>this.mapTypes.find(maptype => maptype.id == this.selectedMapTypeId);
  }

  reCenter() {
    this.mapViewModel.latitude += 0.000000001;
    this.mapViewModel.longitude += 0.000000001;
  }
  inActiveLocationFlagCheck() {
    this.ngOnChanges()
  }
  drawMarkers() {
    if (this.drawLocationList && this.drawLocationList.length > 0) {
      this.markers = this.drawLocationList;
      this.mapViewModel.zoom = 8;
      if (this.drawLocationList.length > 39) {
        this.mapViewModel.latitude = this.drawLocationList[40].geographicLoc.latitude;
        this.mapViewModel.longitude = this.drawLocationList[40].geographicLoc.longitude;
      } else {
        this.mapViewModel.latitude = this.drawLocationList[0].geographicLoc.latitude;
        this.mapViewModel.longitude = this.drawLocationList[0].geographicLoc.longitude;
      }
    } else {
      console.log('Error in lcation API -' + this.drawLocationList);
    }
  }

  toggleLegend() {
    this.showLegend = false;
    /*if (this.showLegend) {
      this.showLegend = false;
    }
    else {
      this.showLegend = true;
    }*/
  }
  hideLegend() {
    this.showLegend = true;
  }

  addLocation() {
    this._dialog.open(AddLocationComponent, {
      disableClose: true,
      data: {

      }
    }).afterClosed().subscribe(res => {
      this.loadRefreshMap();
    });
  }


  // open location detail pop up when marker is clicked
  getMarkerLocationDetails(location: Locations) {
    console.log('Inside getMarkerLocationDetails.');
    let customerId = this.customerService.customerId;
    this._mapService.getMarkerLocationDetails(location.locationId, customerId)
      .map(result => {
        // if result exists then we map it to required object
        this.locationDetails = new LocationDetails();
        if (!(result === undefined || result.locationID === undefined || result.locationID === 0)) {
          this.locationDetails.series = result.series;
          this.locationDetails.serialNumber = result.serialNumber;
          this.locationDetails.isActive = result.isActive;
          this.locationDetails.description = result.description;
          this.locationDetails.manholeAddress = result.manholeAddress;
          this.locationDetails.coordinate.latitude = parseFloat(result.coordinates.split(',')[0]);
          this.locationDetails.coordinate.longitude = parseFloat(result.coordinates.split(',')[1]);
          this.locationDetails.locationID = result.locationID;
          this.locationDetails.locationName = result.locationName;
        }
        return this.locationDetails;
      })
      .subscribe(
      result => {
        if (!(result === undefined || result.locationID === undefined || result.locationID === 0)) {
          this.locationDetails = <LocationDetails>result;
          this.zone.run(() => {
            this.showLocationDetail = false;
          });
        }
        // tslint:disable-next-line:one-line
        else {
          this.showLocationDetail = true;
        }
      }
      );
  }

  // close location detail pop up
  closeMapLocationDetailPopup(markerLocationDetailsStatus) {
    this.showLocationDetail = markerLocationDetailsStatus;
  }


  // open locations pop up when cluster is clicked
  getMarkerLocations(clusterLocations: Locations) {
    console.log('Inside getMarkerLocations.');
    this.clusterLocations = clusterLocations;
    this.showLocationDetail = true;
    this.showLocations = false;
    if (document.getElementById('locationListId') !== null) {
      document.getElementById('locationListId').scrollTop = 0;
    }
  }

  // close locations pop up
  closeMapLocationsPopup(markerLocationsStatus) {
    this.showLocations = markerLocationsStatus;
  }


  // tslint:disable-next-line:comment-format
  //it receive event emitter from  when a location is clicked from cluster-location
  openLocationDetailsPopUp(location: Locations) {
    this.showLocations = true;
    this.getMarkerLocationDetails(location);
  }

  onLocationChange(locationId: number) {
    let location = new Locations();
    location.locationId = locationId;
    this.getMarkerLocationDetails(location);
  }
}
