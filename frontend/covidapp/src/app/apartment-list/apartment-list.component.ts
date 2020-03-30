import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import * as moment from "moment";
import { Apartment } from "../models/apartment";
import { ApartmentService } from "../services/apartment.service";

@Component({
  selector: 'app-apartment-list',
  templateUrl: './apartment-list.component.html',
  styleUrls: ['./apartment-list.component.css']
})
export class ApartmentListComponent implements OnInit {
    apartments : Observable<Apartment[]>;
    apartmentsLoaded: Promise<boolean>;

    success: boolean = false;
    date = { begin: '',  end: ''};
    time = { begin: '',  end: ''};
    
    constructor(private apartmentService : ApartmentService) {
    }

    onChange(type) {
	console.log('%s :', type);
    }

    ngOnInit() {
	this.loadApartmentsData();
    }
    
    loadApartmentsData(){
	this.apartments = this.apartmentService.getAllApartments();
	console.log(this.apartments)
        this.apartmentsLoaded = Promise.resolve(true);
    }

    deleteApartment(id){
	this.apartmentService.apartmentDelete(id)
	    .subscribe(
		data => {
		    this.success=true;
		    this.loadApartmentsData();
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


}
