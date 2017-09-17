import { Directive, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { MapsAPILoader, NoOpMapsAPILoader, MouseEvent, GoogleMapsAPIWrapper } from 'angular2-google-maps/core';
import { GoogleMap, Marker } from 'angular2-google-maps/core/services/google-maps-types';
import { Observable } from 'rxjs';
import { Locations } from '../../models/locations';
import '../../../../assets/js/markerclusterer.js';
import { OrderByPipe } from 'app/shared';

declare const MarkerClusterer;
declare const google;

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'custom-map'
})


// tslint:disable-next-line:directive-class-suffix
export class CustomMap implements OnInit {
  @Input() bounds: Locations[];
  @Output() getMarkerLocationDetails: EventEmitter<number> = new EventEmitter<number>();
  @Output() getMarkerLocations: EventEmitter<any> = new EventEmitter<any>();
  flowMonitorSeries: string[] = ['TRITON+', 'Triton', 'Triton IM', 'FlowHawk', 'FlowShark',
    'FlowShark IS', 'FlowShark RT', 'Gateway', 'iCE3', '1502', '1502EM', '1506', '2000', '3000', '3500',
    '3500S', '3600', '4000', '4500', '4500S', '5500', '5600', '7510', '7510'];
  levelMonitorSeries: string[] = ['ECHO', 'FlowAlert'];
  rainFallMonitorSeries: string[] = ['RainAlert III', 'RainAlert II'];

  constructor(private gmapsApi: GoogleMapsAPIWrapper) {
  }


  ngOnInit() { }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges() {
    if (this.bounds.length > 0) {
      this.createMarkers(this.openLocationDetails, this.getMarkerLocationDetails, this.openLocations,
        this.getMarkerLocations);
    }
  }

  // below function will open location details pop up & display further information
  openLocationDetails(locationDetails, outerOutputLocationDetailsParam) {
    outerOutputLocationDetailsParam.emit(locationDetails);
  }


  // below function will open locations pop up & display all locations in cluster
  openLocations(locations, outerOutputLocationsParam) {
    outerOutputLocationsParam.emit(locations);
  }


  // below function is creating markers, cluster, events to listen cluster and marker click
  createMarkers(outerLocationDetailsFunction, outerOutputLocationDetailsParam,
    outerLocationsFunction, outerOutputLocationsParam) {
    let markers = [];
    this.gmapsApi.getNativeMap()
      .then((map) => {
        // Added to test cluster image.
        let markerIcon = {
          url: '../../assets/images/MonitorListGreen.png', // url
          scaledSize: new google.maps.Size(30, 25)
        };

        let style = {
          url: '../../assets/images/circle_dark.png',
          height: 27,
          width: 27,
          textColor: '#FFF',
          textSize: 11,
          backgroundColor: 'transparent',
          backgroundPosition: 'center center'
        };

        let options = {
          imagePath: '../../assets/images/cluster',
          gridSize: 70,
          styles: [style, style, style],
          zoomOnClick: false
        };

        for (let point of this.bounds) {
          /*if(point.locationId===31){
            console.log("Iam Hear")
          }*/
          // console.log("Point >>>>" + point.series)
          if (this.rainFallMonitorSeries.indexOf(point.series) >= 0) {
            if (point.isActiveLocation) {
              markerIcon = {
                url: '../../assets/images/triangle.png', // url
                scaledSize: new google.maps.Size(30, 25)
              };
            } else {
              markerIcon = {
                url: '../../assets/images/triangle_white.png', // url
                scaledSize: new google.maps.Size(30, 25)
              };
            }

          } else if (this.levelMonitorSeries.indexOf(point.series) >= 0) {
            if (point.isActiveLocation) {
              markerIcon = {
                url: '../../assets/images/square.png', // url
                scaledSize: new google.maps.Size(30, 25)
              };
            } else {
              markerIcon = {
                url: '../../assets/images/square_white.png', // url
                scaledSize: new google.maps.Size(30, 25)
              };
            }

          } else if (this.flowMonitorSeries.indexOf(point.series) >= 0) {
            if (point.isActiveLocation) {
              markerIcon = {
                url: '../../assets/images/circle.png', // url
                scaledSize: new google.maps.Size(30, 25)
              };
            } else {
              markerIcon = {
                url: '../../assets/images/circle_white.png', // url
                scaledSize: new google.maps.Size(30, 25)
              };
            }
          } else {
            markerIcon = {
              url: '../../assets/images/GreenNoCoords.png', // url
              scaledSize: new google.maps.Size(30, 25)
            };
          }

          let marker = new google.maps.Marker({
            position: new google.maps.LatLng(point.geographicLoc.latitude, point.geographicLoc.longitude),
            icon: markerIcon,
            value: point
          });
          // console.log(this.bounds);

          google.maps.event.addListener(marker, 'click', function () {
            outerLocationDetailsFunction(marker.value, outerOutputLocationDetailsParam);
          });

          markers.push(marker);
        }
        let markerCluster = new MarkerClusterer(map, markers, options);

        // below code will check if there is a cluster with more then one location then it need to show
        // locations & if only one location then need to show location detail information
        google.maps.event.addListener(markerCluster, 'clusterclick', function (cluster) {
          if (cluster.markers_.length > 1) {

            // get locations from clusters
            let clusterLocations: Locations[] = cluster.markers_.map(value => value.value);
            let filterPipe = new OrderByPipe();
            clusterLocations = filterPipe.transform(clusterLocations, 'locationName', false);
            outerLocationsFunction(clusterLocations, outerOutputLocationsParam);
          }
        });
      });
  }
}
