import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Observable } from "rxjs";
import { Apartment } from "../models/apartment";
import { ApartmentService } from "../services/apartment.service";
import { AuthService } from "../services/auth.service";
import { ActivatedRoute } from "@angular/router";
import { GoogleMapsAPIWrapper, AgmMap, LatLngBounds, LatLngBoundsLiteral} from '@agm/core';

@Component({
  selector: 'app-apartment-view',
  templateUrl: './apartment-view.component.html',
  styleUrls: ['./apartment-view.component.css']
})
export class ApartmentViewComponent implements OnInit, AfterViewInit {
  apartment : Observable<Apartment>;
  apartment_id: number;
  dataLoaded: Promise<boolean>;
  success: boolean=false; 
  errorMessage:string="";
  latitude = 19.1990;
  longitude = 72.8589;
  @ViewChild('AgmMap', {static: false}) agmMap: AgmMap;

  constructor(private apartmentService:ApartmentService,
	      private authService:AuthService,
              private activatedRoute:ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(
      params => {
         this.apartment_id=Number(params.get("id"));
      }  
    )
    this.loadApartmentData();

  }
  ngAfterViewInit() {
	  console.log("I am here");
	  console.log(this.agmMap);
  } 
  loadApartmentData(){
    this.apartmentService.getApartment(this.apartment_id)
         .subscribe(
            data => {
              this.apartment = data;
	      this.latitude = +this.apartment["latitude"]
	      this.longitude = +this.apartment["longitude"]
	      console.log(this.latitude)
	      console.log(this.longitude)
              this.dataLoaded = Promise.resolve(true);
	      console.log("I am here");
	      console.log(this.agmMap);
            }
          );
  }
  checkMarkersInBounds(bounds) {
	  console.log(bounds)
  }

}
