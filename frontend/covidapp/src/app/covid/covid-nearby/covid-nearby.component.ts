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
    radius = 5000;
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
                            lat: this.latitude + Math.random()-0.5,
                            lng: this.longitude + Math.random()-0.5,
                            label: '😄',
                            draggable: false,
                            content: `Content no ${i}`,
                            isShown: true,
                            //icon:'./assets/red-dot.png'
                            icon: 'data:image/svg+xml;utf-8, \
<svg width="24" height="24" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"> \
<path fill="yellow" stroke="black" stroke-width="1" d="M3.5 3.5h25v25h-25z" ></path> \
</svg>'
                        }
                    );
                }
                for(let i=50;i<100;i++){
                    this.markers.push(
                        {
                            lat: this.latitude + Math.random()-0.5,
                            lng: this.longitude + Math.random()-0.5,
                            label: '😇',
                            draggable: false,
                            content: `Content no ${i}`,
                            isShown: true,
                            //icon:'./assets/blue-dot.png'
                            icon: 'data:image/svg+xml;utf-8, \
<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"> \
<path fill="lightgreen" stroke="black" stroke-width="0.5" d="M3.5 3.5h25v25h-25z" ></path> \
</svg>'
                        }
                    );
                }
                for(let i=100;i<150;i++){
                    this.markers.push(
                        {
                            lat: this.latitude + Math.random()-0.5,
                            lng: this.longitude + Math.random()-0.5,
                            label: '💗',
                            draggable: false,
                            content: `Content no ${i}`,
                            isShown: true,
                            //icon:'./assets/green-dot.png'
                            icon: 'data:image/svg+xml;utf-8, \
<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"> \
<path fill="red" stroke="black" stroke-width="1" d="M3.5 3.5h25v25h-25z" ></path> \
</svg>'
                        }
                    );
                }
                for(let i=150;i<200;i++){
                    this.markers.push(
                        {
                            lat: this.latitude + Math.random()-0.5,
                            lng: this.longitude + Math.random()-0.5,
                            label: '🔥',
                            draggable: false,
                            content: `Content no ${i}`,
                            isShown: true,
                            //icon:'./assets/yellow-dot.png'
                            icon: 'data:image/svg+xml;utf-8, \
<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"> \
<path fill="orange" stroke="black" stroke-width="1" d="M3.5 3.5h25v25h-25z" ></path> \
</svg>'
                        }
                    );
                }
                for(let i=150;i<200;i++){
                    this.markers.push(
                        {
                            lat: this.latitude + Math.random()-0.5,
                            lng: this.longitude + Math.random()-0.5,
                            label: '😀',
                            draggable: false,
                            content: `Content no ${i}`,
                            isShown: true,
                            //icon:'./assets/yellow-dot.png'
                            icon: 'data:image/svg+xml;utf-8, \
<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"> \
<path fill="gray" stroke="black" stroke-width="1" d="M3.5 3.5h25v25h-25z" ></path> \
</svg>'
                        }
                    );
                }
                for(let i=150;i<200;i++){
                    this.markers.push(
                        {
                            lat: this.latitude + Math.random()-0.5,
                            lng: this.longitude + Math.random()-0.5,
                            label: '$',
                            draggable: false,
                            content: `Content no ${i}`,
                            isShown: true,
                            //icon:'./assets/yellow-dot.png'
                            icon: 'data:image/svg+xml;utf-8, \
<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">\
  <symbol id="fish" viewBox="0 26 100 48"> \
    <path d="M98.5,47.5C96.5,45.5,81,35,62,35c-2.1,0-4.2,0.1-6.2,0.3L39,26c0,4.5,1.3,9,2.4,12.1C31.7,40.7,23.3,44,16,44L0,34 \
    c0,8,4,16,4,16s-4,8-4,16l16-10c7.3,0,15.7,3.3,25.4,5.9C40.3,65,39,69.5,39,74l16.8-9.3c2,0.2,4.1,0.3,6.2,0.3 \
    c19,0,34.5-10.5,36.5-12.5S100.5,49.5,98.5,47.5z M85.5,50c-1.4,0-2.5-1.1-2.5-2.5s1.1-2.5,2.5-2.5s2.5,1.1,2.5,2.5 \
    C88,48.9,86.9,50,85.5,50z"/>  \
  </symbol> \
</svg> \
'
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
