import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Observable, Subject } from 'rxjs';
import { map, debounceTime, merge, share, startWith, switchMap } from 'rxjs/operators';
import * as moment from "moment";

import { Page } from '../pagination';
import { Apartment } from "../models/apartment";
import { ApartmentFilterService } from "../services/apartment-filter.service";
import { ApartmentService } from "../services/apartment.service";
import { AuthService } from "../services/auth.service";

@Component({
  selector: 'app-apartment-filter',
  templateUrl: './apartment-filter.component.html',
  styleUrls: ['./apartment-filter.component.css']
})
export class ApartmentFilterComponent  {
  filterForm: FormGroup;
  page: Observable<Page<Apartment>>;
  pageUrl = new Subject<string>();
  success: boolean = false;
  dataLoaded: Promise<boolean>;
  constructor(
    public authService: AuthService, private apartmentService: ApartmentService
  ) {
    this.filterForm = new FormGroup({
      is_available: new FormControl(),

      number_of_rooms__lte : new FormControl('', [
                                  Validators.required,
                                  Validators.pattern('[0-9]')]
                               ),
      //number_of_rooms__lte : new FormControl(),
      number_of_rooms__gte : new FormControl(),
      floor_area_size__lte : new FormControl(),
      floor_area_size__gte : new FormControl(),
      price_per_month__lte : new FormControl(),
      price_per_month__gte : new FormControl(),
      limit : new FormControl(10),
      ordering : new FormControl('-updated'),
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
    console.log("Load page is getting executed")
    this.page = this.filterForm.valueChanges.pipe(
      debounceTime(200),
      startWith(this.filterForm.value),
      merge(this.pageUrl),
      switchMap(urlOrFilter => this.apartmentService.list(urlOrFilter)),
      share()
    );
    this.dataLoaded = Promise.resolve(true);
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
            console.log("this will delete all apartments");
            this.apartmentService.apartmentBulkDelete({'user_ids': ['all'] })
	    .subscribe(
		data => {
		    this.success=true;
		    this.loadpage();
		},
		error => console.log("could not delete" + error)
            )

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


}
