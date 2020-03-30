import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Observable, Subject } from 'rxjs';
import { debounceTime, merge, share, startWith, switchMap } from 'rxjs/operators';
import * as moment from "moment";

import { Page } from '../pagination';
import { Apartment } from "../models/apartment";
import { ApartmentFilterService } from "../services/apartment-filter.service";
import { ApartmentService } from "../services/apartment.service";
import { AuthService } from "../services/auth.service";
import {Router} from "@angular/router"

@Component({
  selector: 'app-apartment-map',
  templateUrl: './apartment-map.component.html',
  styleUrls: ['./apartment-map.component.css']
})
export class ApartmentMapComponent  {
  latitude = 19.1990;
  longitude = 72.8589;
  lat_max:number = 20.23320865099854;
  //lat_min:number = 18.15824995334333;
  lat_min:number = 20.15824995334333;
  long_min:number = 70.8072032226562;
  long_max:number = 74.9105967773437;
  current_lat_max:number;
  current_lat_min:number;
  current_long_max:number;
  current_long_min:number;
  filterForm: FormGroup;
  page: Observable<Page<Apartment>>;
  pageUrl = new Subject<string>();
  success: boolean = false;
  dataLoaded: Promise<boolean>;
  constructor(
    private authService: AuthService,
    private apartmentService: ApartmentService,
    private router:Router
  ) {
    this.filterForm = new FormGroup({
      is_available: new FormControl(),
      number_of_rooms__lte : new FormControl(),
      number_of_rooms__gte : new FormControl(),
      floor_area_size__lte : new FormControl(),
      floor_area_size__gte : new FormControl(),
      price_per_month__lte : new FormControl(),
      price_per_month__gte : new FormControl(),
      latitude__gte : new FormControl(),
      longitude__gte : new FormControl(),
      latitude__lte : new FormControl(),
      longitude__lte : new FormControl(),
      limit : new FormControl(50),
      search: new FormControl()
    });
    this.page = this.filterForm.valueChanges.pipe(
      debounceTime(200),
      startWith(this.filterForm.value),
      merge(this.pageUrl),
      switchMap(urlOrFilter => this.apartmentService.list(urlOrFilter)),
      share()
    );
    this.dataLoaded = Promise.resolve(true);
  }

  onPageChanged(url: string) {
    this.pageUrl.next(url);
  }
  loadpage(){
    this.page = this.filterForm.valueChanges.pipe(
      debounceTime(200),
      startWith(this.filterForm.value),
      merge(this.pageUrl),
      switchMap(urlOrFilter => this.apartmentService.list(urlOrFilter)),
      share()
    );
    this.dataLoaded = Promise.resolve(true);
  }
  updateData(){
     this.loadpage()
  }
  deleteApartment(id){
	this.apartmentService.apartmentDelete(id)
	    .subscribe(
		data => {
		    this.success=true;
		    this.loadpage();
		},
		error => console.log("could no delete" + error)
            )
    }

    deleteAllApartments(){

    }

  public isUserManager(){
    return ( moment().isBefore(this.getExpiration()) && ( (this.getUserName() === "usermanager") || (this.getUserName() === "admin" )));
  } 
  getUserName(){
      const username = localStorage.getItem("username");
      return username
  } 
  getExpiration() {
      const expiration = localStorage.getItem("expires_at");
      const expiresAt = JSON.parse(expiration);
      return moment(expiresAt);
  }    

  getMapBounds(bounds){
	  console.log(bounds);
	  console.log(bounds.pa.g);
	  this.lat_max = bounds.pa.h;
	  this.lat_min = bounds.pa.g;
	  this.long_max = bounds.ka.h;
	  this.long_min = bounds.ka.g;
  }

  markerClick(apartment_id){
	  console.log("Marker has been clicked");
	  console.log(apartment_id);
          this.router.navigate(['/view/'+apartment_id]);

  }

}
