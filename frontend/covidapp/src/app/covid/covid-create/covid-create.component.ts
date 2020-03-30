import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Covid } from "../../models/covid";
import { CovidService } from "../../services/covid.service";
import { AuthService } from "../../services/auth.service";
import { NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { GeocodeService } from '../../services/geocode.service';
import { Location } from '../../models/location';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { Router } from "@angular/router"


@Component({
    selector: 'app-covid-create',
    templateUrl: './covid-create.component.html',
    styleUrls: ['./covid-create.component.css']
})
export class CovidCreateComponent implements OnInit {
    covid : Covid = new Covid();
    success: boolean = false;
    errorMessage: string="";
    address: string;
    location: Location = {'lat': 28.4720443, 'lng': 77.1329417};
    loading: boolean;

    constructor(private covidService: CovidService,
                private geocodeService: GeocodeService,
                private authService: AuthService,
                private ref: ChangeDetectorRef,
                private router: Router,
               ) { }

    ngOnInit() {
        console.log('Inside setCurrentLocation()')
        this.setCurrentLocation();
        //this.showLocation();
    }

    showLocation() {
        this.addressToCoordinates();
    }

    addressToCoordinates() {
        console.log('Inside addressToCoordinates()')
        this.loading = true;
        this.geocodeService.geocodeAddress(this.address)
            .subscribe((location: Location) => {
                this.location = location;
                console.log(typeof((location.lat.toFixed(6))));
                console.log(location.lat.toFixed(6));
                console.log(typeof((location.lng.toFixed(6))));
                console.log(location.lng.toFixed(6));
                this.covid.latitude = Number(location.lat.toFixed(6));
                this.covid.longitude = Number(location.lng.toFixed(6));
                this.loading = false;
                this.ref.detectChanges();
            });
    }

    /* Get address given the location
    setCurrentAddress(location) {
        this.geocodeService.geocoder({
            'location': { lat: location.lat, lng: location.lng }
        }, (results, status) => {
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
    }*/
    // Get Current Location Coordinates
    private setCurrentLocation() {
        console.log('Inside setCurrentLocation()')
        if ('geolocation' in navigator) {
            console.log('geolocation found in navigator')
            this.loading = true;
            navigator.geolocation.getCurrentPosition((position) => {
                console.log('Inside getCurrentLocation()')
                this.location.lat = position.coords.latitude;
                this.location.lng = position.coords.longitude;
                // FIXME - Ask Goli
                // this.covid.latitude = Number(String(this.location.lat).toFixed(6));
                // this.covid.longitude = Number(String(this.location.lng).toFixed(6));
                // this.zoom = 8;
                //this.getAddress(this.latitude, this.longitude);
                this.covid.latitude = Number(this.location.lat.toFixed(6));
                this.covid.longitude = Number(this.location.lng.toFixed(6));
                this.loading = false;
                this.ref.detectChanges();
                console.log(this.location, this.address)
            }, err => {
                console.log(err);
                this.success=false;
                this.errorMessage=err.message + '(Broswer not able to detect location, assuming default. Kindly ignore)'; //FIXME
                console.log(this.errorMessage);
                this.loading = false;
            });
        }
        else {
            console.log("Geolocation is not supported by this browser.");
            alert("Geolocation is not supported by this browser.");
            //this.location.lat = 28.4720443;
            //this.location.lng = 77.1329417;
            this.covid.latitude = Number(this.location.lat.toFixed(6));
            this.covid.longitude = Number(this.location.lng.toFixed(6));
            this.loading = false;
            this.ref.detectChanges();
            // this.zoom = 15;
        }
    }

    markerDragEnd($event: MouseEvent) {
        console.log($event);
        this.location.lat = $event.coords.lat;
        this.location.lng = $event.coords.lng;
        this.covid.latitude = Number($event.coords.lat.toFixed(6));
        this.covid.longitude = Number($event.coords.lng.toFixed(6));
    }

    onSubmit() {
        this.covidService.createItem(this.covid)
            .subscribe(
                data => {
                    this.success=true;
                    console.log("Covid create Successful!");
                }, err => {
                    console.log(err.error);
                    this.success=false;
                    this.errorMessage=this.authService.getErrorMessage(err);
                });
    }
}
