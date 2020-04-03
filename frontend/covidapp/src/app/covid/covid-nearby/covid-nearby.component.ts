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
const DEFAULT_ZOOM=11;

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
    dynamicMarkers = []

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
                this.zoom = DEFAULT_ZOOM;

                // this.setMarkers();
                
                for(let i=1;i<50;i++){
                    this.markers.push(
                        {
                            lat: this.latitude + Math.random()-0.5,
                            lng: this.longitude + Math.random()-0.5,
                            label: '',
                            draggable: false,
                            content: `Content no ${i}`,
                            isShown: true,
                            //Green People
                            icon: 'data:image/svg+xml;utf-8, <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24"><path fill="green" stroke="black" stroke-width=".5" d="M16 17V19H2V17S2 13 9 13 16 17 16 17M12.5 7.5A3.5 3.5 0 1 0 9 11A3.5 3.5 0 0 0 12.5 7.5M15.94 13A5.32 5.32 0 0 1 18 17V19H22V17S22 13.37 15.94 13M15 4A3.39 3.39 0 0 0 13.07 4.59A5 5 0 0 1 13.07 10.41A3.39 3.39 0 0 0 15 11A3.5 3.5 0 0 0 15 4Z" /></svg>'
                        }
                    );
                }
                for(let i=50;i<100;i++){
                    this.markers.push(
                        {
                            lat: this.latitude + Math.random()-0.5,
                            lng: this.longitude + Math.random()-0.5,
                            label: '',
                            draggable: false,
                            content: `Content no ${i}`,
                            isShown: true,
                            //Red People
                            icon: 'data:image/svg+xml;utf-8, <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24"><path fill="red" stroke="black" stroke-width=".5" d="M16 17V19H2V17S2 13 9 13 16 17 16 17M12.5 7.5A3.5 3.5 0 1 0 9 11A3.5 3.5 0 0 0 12.5 7.5M15.94 13A5.32 5.32 0 0 1 18 17V19H22V17S22 13.37 15.94 13M15 4A3.39 3.39 0 0 0 13.07 4.59A5 5 0 0 1 13.07 10.41A3.39 3.39 0 0 0 15 11A3.5 3.5 0 0 0 15 4Z" /></svg>'
                        }
                    );
                }
                for(let i=100;i<150;i++){
                    this.markers.push(
                        {
                            lat: this.latitude + Math.random()-0.5,
                            lng: this.longitude + Math.random()-0.5,
                            label: '',
                            draggable: false,
                            content: `Content no ${i}`,
                            isShown: true,
                            //Blue Support
                            icon: 'data:image/svg+xml;utf-8, <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24"><path fill="blue" stroke="black" stroke-width=".5" d="M4,8H8V4A2,2 0 0,1 10,2H14A2,2 0 0,1 16,4V8H20A2,2 0 0,1 22,10V14A2,2 0 0,1 20,16H16V20A2,2 0 0,1 14,22H10A2,2 0 0,1 8,20V16H4A2,2 0 0,1 2,14V10A2,2 0 0,1 4,8Z" /></svg>'
                        }
                    );
                }
                for(let i=150;i<200;i++){
                    this.markers.push(
                        {
                            lat: this.latitude + Math.random()-0.5,
                            lng: this.longitude + Math.random()-0.5,
                            label: '',
                            draggable: false,
                            content: `Content no ${i}`,
                            isShown: true,
                            //Grey Support
                            icon: 'data:image/svg+xml;utf-8, <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24"><path fill="gray" stroke="black" stroke-width=".5" d="M4,8H8V4A2,2 0 0,1 10,2H14A2,2 0 0,1 16,4V8H20A2,2 0 0,1 22,10V14A2,2 0 0,1 20,16H16V20A2,2 0 0,1 14,22H10A2,2 0 0,1 8,20V16H4A2,2 0 0,1 2,14V10A2,2 0 0,1 4,8Z" /></svg>'
                            /*
                              icon: 'data:image/svg+xml;utf-8, \
                              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"> \
                              <path d="M0 0h48v48H0z" fill="none"/> \
                              <path fill="gray" stroke="black" stroke-width=".5" d="M38 6H10c-2.21 0-3.98 1.79-3.98 4L6 38c0 2.21 1.79 4 4 4h28c2.21 0 4-1.79 4-4V10c0-2.21-1.79-4-4-4zm-2 22h-8v8h-8v-8h-8v-8h8v-8h8v8h8v8z"/> \
                              </svg>'
                            */
                        }
                    );
                }
                for(let i=200;i<250;i++){
                    this.markers.push(
                        {
                            lat: this.latitude + Math.random()-0.5,
                            lng: this.longitude + Math.random()-0.5,
                            label: '',
                            draggable: false,
                            content: `Content no ${i}`,
                            isShown: true,
                            // Black Plane
                            icon: 'data:image/svg+xml;utf-8, \
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"> \
<path d="M10.18 9"/> \
<path fill="black" stroke="black" stroke-width=".5" d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/> \
<path d="M0 0h24v24H0z" fill="none"/> \
</svg>'
                        }
                    );
                }
                for(let i=250;i<300;i++){
                    this.markers.push(
                        {
                            lat: this.latitude + Math.random()-0.5,
                            lng: this.longitude + Math.random()-0.5,
                            label: '',
                            draggable: false,
                            content: `Content no ${i}`,
                            isShown: true,
                            // Grey Plane
                            icon: 'data:image/svg+xml;utf-8, \
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"> \
<path d="M10.18 9"/> \
<path fill="gray" stroke="black" stroke-width=".5" d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/> \
<path d="M0 0h24v24H0z" fill="none"/> \
</svg>'
                        }
                    );
                }
            });
        }
    }

    setMarkers() {
        var icon = {

            path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
            fillColor: '#FF0000',
            fillOpacity: .6,
            anchor: new google.maps.Point(0,0),
            strokeWeight: 0,
            scale: 1
        }
        for(let i=0;i<300;i++){
            this.dynamicMarkers.push(
                {
                    latitude: this.latitude + Math.random()-0.5,
                    longitude: this.longitude + Math.random()-0.5,
                    label: '#',
                    draggable: false,
                    content: `Content no ${i}`,
                    isShown: true,
                    //icon:'./assets/yellow-dot.png'
                    iconAnchorX: 0,
                    iconAnchorY: 0,
                    iconHeight: 24,
                    iconWidth: 24,
                    iconUrl: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0"
                }
            );
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
