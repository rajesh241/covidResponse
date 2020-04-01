import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';

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

const ZOOM_DEFAULT = 12;

@Component({
    selector: 'app-covid-search',
    templateUrl: './covid-search.component.html',
    styleUrls: ['./covid-search.component.css']
})
export class CovidSearchComponent implements OnInit {
    title: string = 'Covid Search';
    latitude: number;
    longitude: number;
    zoom:number;
    address: string;
    private geoCoder;

    // FIXME: 2nd Argument added for Angular 8
    @ViewChild('search', { static: false })
    public searchElementRef: ElementRef;

    // Which format to show?
    located: boolean = true;
    // Radius
    radius = 5000;
    radiusLat = 0;
    radiusLong = 0;

    markers: marker[] = []

    constructor(
        private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone
    ) {
    }

    ngOnInit() {
        console.log('Inside ngOnInit()')
        //load Places Autocomplete
        this.mapsAPILoader.load().then(() => {
            this.setCurrentLocation();
            this.geoCoder = new google.maps.Geocoder;

            let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {});
            autocomplete.addListener("place_changed", () => {
                this.ngZone.run(() => {
                    //get the place result
                    let place: google.maps.places.PlaceResult = autocomplete.getPlace();

                    //verify result
                    if (place.geometry === undefined || place.geometry === null) {
                        return;
                    }

                    //set latitude, longitude and zoom
                    this.latitude = place.geometry.location.lat();
                    this.longitude = place.geometry.location.lng();
                    this.zoom = ZOOM_DEFAULT;
                });
            });
        });
    }

    // Get Current Location Coordinates
    private setCurrentLocation() {
        console.log('Inside setCurrentLocation()')
        if ('geolocation' in navigator) {
            console.log('geolocation found in navigator')
            navigator.geolocation.getCurrentPosition((position) => {
                console.log('Inside getCurrentLocation()')
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
                this.radiusLat = this.latitude;
                this.radiusLong = this.longitude;
                this.zoom = ZOOM_DEFAULT;
                this.getAddress(this.latitude, this.longitude);
                console.log(this.latitude, this.longitude, this.zoom);
                this.setMarkers();
            }, err => {
                console.log('Errored: ');
                console.log(err);  // FIXME on screen modal or display
            });
        }
        else {
            console.log("Geolocation is not supported by this browser.");
            alert("Geolocation is not supported by this browser.");
            this.latitude = 28.4720443;
            this.longitude = 77.1329417;
            this.radiusLat = this.latitude;
            this.radiusLong = this.longitude;
            this.zoom = ZOOM_DEFAULT;
            this.getAddress(this.latitude, this.longitude);
            console.log(this.latitude, this.longitude, this.zoom)
        }
    }

    setMarkers() {
        for(let i=1;i<50;i++){
            this.markers.push(
                {
                    lat: this.latitude + Math.random()-0.5,
                    lng: this.longitude + Math.random()-0.5,
                    label: '', //`${i}`,
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
                    lat: this.latitude + Math.random()-0.5,
                    lng: this.longitude + Math.random()-0.5,
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
                    lat: this.latitude + Math.random()-0.5,
                    lng: this.longitude + Math.random()-0.5,
                    label: '', //`${i}`,
                    draggable: false,
                    content: `Content no ${i}`,
                    isShown: true,
                    icon:'./assets/green-dot.png'
                }
            );
        }
    }

    markerDragEnd($event: MouseEvent) {
        console.log($event);
        this.latitude = $event.coords.lat;
        this.longitude = $event.coords.lng;
        this.getAddress(this.latitude, this.longitude);
        this.radiusLat = this.latitude;
        this.radiusLong = this.longitude;
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
            value.isShown = true; // this.getDistanceBetween(value.lat,value.lng,this.radiusLat,this.radiusLong);
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

    getAddress(latitude, longitude) {
        this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
            console.log(results);
            console.log(status);
            if (status === 'OK') {
                if (results[0]) {
                    this.zoom = ZOOM_DEFAULT;
                    this.address = results[0].formatted_address;
                } else {
                    window.alert('No results found');
                }
            } else {
                window.alert('Geocoder failed due to: ' + status);
            }
        });
    }
}
