import { Apartment } from "../models/apartment";
import { ApartmentService } from "../services/apartment.service";
import { AuthService } from "../services/auth.service";
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { GeocodeService } from '../services/geocode.service';
import { Location } from '../models/location';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import {Router} from "@angular/router"



@Component({
  selector: 'app-apartment-create',
  templateUrl: './apartment-create.component.html',
  styleUrls: ['./apartment-create.component.css']
})
export class ApartmentCreateComponent implements OnInit {
  apartment : Apartment = new Apartment();
  success: boolean = false;
  errorMessage:string="";
  address = 'Mumbai';
  location: Location;
  loading: boolean;
  constructor(private apartmentService: ApartmentService,
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
	this.apartment.latitude = Number(location.lat.toFixed(6));
	this.apartment.longitude = Number(location.lng.toFixed(6));
        this.loading = false;
        this.ref.detectChanges();  
      }      
    );     
  }

  markerDragEnd($event: MouseEvent) {
    console.log($event);
    this.location.lat = $event.coords.lat;
    this.location.lng = $event.coords.lng;
    this.apartment.latitude = Number($event.coords.lat.toFixed(6));
    this.apartment.longitude = Number($event.coords.lng.toFixed(6));
  }

  onSubmit(){
    this.saveApartment();
  }
  saveApartment(){
     this.apartmentService.apartmentCreate(this.apartment)
       .subscribe(
         data => {
           this.success=true;
           console.log("Apartment create Successful!");
           this.router.navigate(['/apartments']);
	},
        err => {
           console.log(err.error);
           this.success=false;
	   this.errorMessage=this.authService.getErrorMessage(err);
        }
       );
  }
}
