import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Context } from "../../models/context";
import { ContextService } from "../../services/context.service";
import { AuthService } from "../../services/auth.service";
import { NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { GeocodeService } from '../../services/geocode.service';
import { Location } from '../../models/location';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { Router } from "@angular/router"


@Component({
  selector: 'app-context-create',
  templateUrl: './context-create.component.html',
  styleUrls: ['./context-create.component.css']
})
export class ContextCreateComponent implements OnInit {
    context : Context = new Context();
    success: boolean = false;
    errorMessage: string="";
    address: string;
    location: Location = {'lat': 28.4720443, 'lng': 77.1329417};
    loading: boolean;
    form_type: string;

    constructor(private contextService: ContextService,
                private geocodeService: GeocodeService,
                private authService: AuthService,
                private activatedRoute:ActivatedRoute,
                private ref: ChangeDetectorRef,
                private router: Router,
               ) { }

    ngOnInit() {
        this.activatedRoute.paramMap.subscribe(
          params => {
             this.form_type=params.get("form");
          }  
        )
        console.log('Inside setCurrentLocation()')
        this.setCurrentLocation();
        //this.showLocation();
	console.log('Form type is ' + this.form_type);
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
                this.context.latitude = Number(location.lat.toFixed(6));
                this.context.longitude = Number(location.lng.toFixed(6));
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
                // this.context.latitude = Number(String(this.location.lat).toFixed(6));
                // this.context.longitude = Number(String(this.location.lng).toFixed(6));
                // this.zoom = 8;
                //this.getAddress(this.latitude, this.longitude);
                this.context.latitude = Number(this.location.lat.toFixed(6));
                this.context.longitude = Number(this.location.lng.toFixed(6));
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
            this.context.latitude = Number(this.location.lat.toFixed(6));
            this.context.longitude = Number(this.location.lng.toFixed(6));
            this.loading = false;
            this.ref.detectChanges();
            // this.zoom = 15;
        }
    }

    markerDragEnd($event: MouseEvent) {
        console.log($event);
        this.location.lat = $event.coords.lat;
        this.location.lng = $event.coords.lng;
        this.context.latitude = Number($event.coords.lat.toFixed(6));
        this.context.longitude = Number($event.coords.lng.toFixed(6));
    }

    onSubmit() {
        this.contextService.createItem(this.context)
            .subscribe(
                data => {
                    this.success=true;
                    console.log("Context create Successful!");
                }, err => {
                    console.log(err.error);
                    this.success=false;
                    this.errorMessage=this.authService.getErrorMessage(err);
                });
    }
}
