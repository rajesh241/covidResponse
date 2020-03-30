import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable } from "rxjs";
import { Apartment } from "../models/apartment";
import { ApartmentService } from "../services/apartment.service";
import { AuthService } from "../services/auth.service";
import { ActivatedRoute } from "@angular/router";
import {Router} from "@angular/router"
import { GeocodeService } from '../services/geocode.service';
import { Location } from '../models/location';
import { MapsAPILoader, MouseEvent } from '@agm/core';
@Component({
  selector: 'app-apartment-edit',
  templateUrl: './apartment-edit.component.html',
  styleUrls: ['./apartment-edit.component.css']
})
export class ApartmentEditComponent implements OnInit {
  apartment : Observable<Apartment>;
  apt : Apartment;
  apartment_id: number;
  success: boolean=false; 
  errorMessage:string="";
  dataLoaded: Promise<boolean>;
  apartment_loaded:boolean=false;
  address:string;
  location: Location;
  latitude:number = 25.444780;
  longitude:number = 81.843217
  loading: boolean;
  constructor(private apartmentService:ApartmentService,
	      public authService:AuthService,
              private activatedRoute:ActivatedRoute,
              private geocodeService: GeocodeService,
              private ref: ChangeDetectorRef,
              private router: Router) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(
      params => {
         this.apartment_id=Number(params.get("id"));
      }  
    )
    this.loadApartmentData();

  }
 
  loadApartmentData(){
    this.apartmentService.getApartment(this.apartment_id)
         .subscribe(
            data => {
              this.apartment = data;
              this.latitude = +this.apartment['latitude'];
              this.longitude = +this.apartment['longitude'];
	      console.log(this.latitude);
	      console.log(this.longitude);
              this.dataLoaded = Promise.resolve(true);
            }
          );
  }
  updateApartment() {
     this.apartmentService.apartmentUpdate(this.apartment_id,this.apartment)
         .subscribe(
             data => {
                this.apartment = data as Observable<Apartment>;
                this.success = true;
                //this.router.navigate(['/view/'+this.apartment["id"]]);
                this.router.navigate(['/apartments/']);
	     },
             err => {
                console.log(err.error);
                this.success=false;
	        this.errorMessage=this.authService.getErrorMessage(err);
		}
            );
   }
  onSubmit(){
       this.updateApartment();
    }

  showLocation() {
    this.addressToCoordinates();
  }
  addressToCoordinates() {
    this.loading = true;
    this.geocodeService.geocodeAddress(this.address)
    .subscribe((location: Location) => {
        this.location = location;
	this.latitude = location.lat;
	this.longitude = location.lng;
	this.apt.latitude = Number(location.lat.toFixed(6));
	this.apt.longitude = Number(location.lng.toFixed(6));
        this.loading = false;
        this.ref.detectChanges();  
      }      
    );     
  }

  markerDragEnd($event: MouseEvent) {
    console.log($event);
    this.location.lat = $event.coords.lat;
    this.location.lng = $event.coords.lng;
    this.apt.latitude = Number($event.coords.lat.toFixed(6));
    this.apt.longitude = Number($event.coords.lng.toFixed(6));
  }


}
