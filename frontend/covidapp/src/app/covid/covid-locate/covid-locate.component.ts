import { Component, OnInit, Input, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';

@Component({
    selector: 'app-covid-locate',
    templateUrl: './covid-locate.component.html',
    styleUrls: ['./covid-locate.component.css']
})
export class CovidLocateComponent implements OnInit {
    title: string = 'AGM project';
    latitude: number;
    longitude: number;
    zoom:number;
    address: string;
    private geoCoder;

    @Input() autoDetect: boolean = true;
    @Input('entity') entity: any;

    @ViewChild('search', { static: false })
    public searchElementRef: ElementRef;

    constructor(
        private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone
    ) {
    }

    ngOnInit() {
        console.log('Inside ngOnInit()')
        console.log(this.autoDetect);
        if (this.entity)
            console.log(this.entity);

        //load Places Autocomplete
        this.mapsAPILoader.load().then(() => {
            this.geoCoder = new google.maps.Geocoder;
            this.setCurrentLocation();

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
                    this.zoom = 12;
                });
            });
        });
    }

    // Get Current Location Coordinates
    private setCurrentLocation() {
        console.log('Inside setCurrentLocation()')
        if (this.entity) {
            this.latitude = Number(this.entity.latitude);
            this.longitude = Number(this.entity.longitude);
            this.zoom = 8;
            this.getAddress(this.latitude, this.longitude);
            console.log(this.latitude, this.longitude, this.zoom)
        }
        else if ('geolocation' in navigator) {
            console.log('geolocation found in navigator')
            navigator.geolocation.getCurrentPosition((position) => {
                console.log('Inside getCurrentLocation()')
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
                this.zoom = 8;
                this.getAddress(this.latitude, this.longitude);
                console.log(this.latitude, this.longitude, this.zoom)
            }, function(e) {
                console.log('Errored: ')
                console.log(e)
            });
        }
        else {
            console.log("Geolocation is not supported by this browser.");
            alert("Geolocation is not supported by this browser.");
            this.latitude = 28.4720443;
            this.longitude = 77.1329417;
            this.zoom = 15;
        }
    }

    markerDragEnd($event: MouseEvent) {
        console.log($event);
        this.latitude = $event.coords.lat;
        this.longitude = $event.coords.lng;
        this.getAddress(this.latitude, this.longitude);
    }

    getAddress(latitude, longitude) {
        this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
            console.log(results);
            console.log(status);
            if (status === 'OK') {
                if (results[0]) {
                    this.zoom = 12;
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
