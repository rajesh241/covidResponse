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
    errorMessage:string="";
    address = 'Mumbai';
    location: Location;
    loading: boolean;

    constructor(private covidService: CovidService,
                private geocodeService: GeocodeService,
                private authService: AuthService,
                private ref: ChangeDetectorRef,
                private router: Router,
               ) { }

    ngOnInit() {
        this.showLocation();
    }

    showLocation() {
        this.addressToCoordinates();
    }

    addressToCoordinates() {
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

    markerDragEnd($event: MouseEvent) {
        console.log($event);
        this.location.lat = $event.coords.lat;
        this.location.lng = $event.coords.lng;
        this.covid.latitude = Number($event.coords.lat.toFixed(6));
        this.covid.longitude = Number($event.coords.lng.toFixed(6));
    }

    onSubmit(){
        this.saveCovid();
    }
    saveCovid(){
        this.covidService.createItem(this.covid)
            .subscribe(
                data => {
                    this.success=true;
                    console.log("Covid create Successful!");
                },
                err => {
                    console.log(err.error);
                    this.success=false;
                    this.errorMessage=this.authService.getErrorMessage(err);
                });
    }
}
