import { Component, OnInit } from '@angular/core';
import { MapsAPILoader } from '@agm/core';

// just an interface for type safety.
interface marker {
    lat: number;
    lng: number;
    label?: string;
    draggable: boolean;
    content?:string;
    isShown:boolean;
    icon:string;
}

@Component({
  selector: 'app-covid-nearby',
  templateUrl: './covid-nearby.component.html',
  styleUrls: ['./covid-nearby.component.css']
})
export class CovidNearbyComponent implements OnInit {
  title: string = 'AGM project';
  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  private geoCoder;

  // Radius
  radius = 10000;
  radiusLat = 0;
  radiusLong = 0;

  markers: marker[] = []

  constructor(private mapsAPILoader: MapsAPILoader) { }

  ngOnInit(): void {
    //load Map
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
    });
  }

  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.radiusLat = this.latitude;
        this.radiusLong = this.longitude;
        this.zoom = 12;

        for(let i=1;i<50;i++){
          this.markers.push(
            {
              lat: this.latitude+Math.random(),
              lng: this.longitude+Math.random(),
              label: `${i}`,
              draggable: false,
              content: `Content no ${i}`,
              isShown: true,
              icon:'./assets/red-dot.png'
            }
          );
        }
        for(let i=50;i<100;i++){
          this.markers.push(
            {
              lat: this.latitude+Math.random(),
              lng: this.longitude+Math.random(),
                label: '', //`${i}`,
              draggable: false,
              content: `Content no ${i}`,
              isShown: true,
              icon:'./assets/blue-dot.png'
            }
          );
        }
        for(let i=100;i<150;i++){
          this.markers.push(
            {
              lat: this.latitude+Math.random(),
              lng: this.longitude+Math.random(),
              label: `${i}`,
              draggable: false,
              content: `Content no ${i}`,
              isShown: true,
              icon:'./assets/green-dot.png'
            }
          );
        }
        for(let i=150;i<200;i++){
          this.markers.push(
            {
              lat: this.latitude+Math.random(),
              lng: this.longitude+Math.random(),
              label: `${i}`,
              draggable: false,
              content: `Content no ${i}`,
              isShown: true,
              icon:'./assets/marker-red.png'
            }
          );
        }

      });
    }
  }

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
  }

  radiusDragEnd($event: any) {
    console.log($event);
    this.radiusLat = $event.coords.lat;
    this.radiusLong = $event.coords.lng;
    this.showHideMarkers();
  }

  event(type,$event) {
    console.log(type,$event);
    this.radius = $event;
    this.showHideMarkers();
  }

  showHideMarkers(){
    Object.values(this.markers).forEach(value => {
      value.isShown = this.getDistanceBetween(value.lat,value.lng,this.radiusLat,this.radiusLong);
    });
  }

  getDistanceBetween(lat1,long1,lat2,long2){
    var from = new google.maps.LatLng(lat1,long1);
    var to = new google.maps.LatLng(lat2,long2);

    if(google.maps.geometry.spherical.computeDistanceBetween(from,to) <= this.radius){
      console.log('Radius',this.radius);
      console.log('Distance Between',google.maps.geometry.spherical.computeDistanceBetween(
        from,to
      ));
      return true;
    }else{
      return false;
    }
  }
}
