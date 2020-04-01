import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable } from "rxjs";
import { Context } from "../../models/context";
import { ContextService } from "../../services/context.service";
import { AuthService } from "../../services/auth.service";
import { ActivatedRoute } from "@angular/router";
import {Router} from "@angular/router"
import { GeocodeService } from '../../services/geocode.service';
import { Location } from '../../models/location';
import { MapsAPILoader, MouseEvent } from '@agm/core';
@Component({
  selector: 'app-context-edit',
  templateUrl: './context-edit.component.html',
  styleUrls: ['./context-edit.component.css']
})
export class ContextEditComponent implements OnInit {
  //context : Observable<Context>;
  context : any;
  apt : Context;
  context_id: number;
  success: boolean=false; 
  errorMessage:string="";
  dataLoaded: Promise<boolean>;
  context_loaded:boolean=false;
  address:string;
  location: Location;
  latitude:number = 25.444780;
  longitude:number = 81.843217
  loading: boolean;
  isVolunteer:boolean=false;
  editMode:boolean=false;
  allowEdit:boolean=false;
  showLoginMessage:boolean=false;
  constructor(private contextService:ContextService,
	      private authService:AuthService,
              private activatedRoute:ActivatedRoute,
              private geocodeService: GeocodeService,
              private ref: ChangeDetectorRef,
              private router: Router) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(
      params => {
         this.context_id=Number(params.get("id"));
      }  
    )
    this.loadContextData();

  }
 
  loadContextData(){
    this.contextService.getItemPublic(this.context_id)
         .subscribe(
            data => {
              this.context = data;
	      if (this.context['record_type'] == "needHelp"){
		      this.isVolunteer=false;
	      }else{
		      this.isVolunteer=true;
	      }
	      console.log("received data is " + this.context['name']);
              this.latitude = +this.context['latitude'];
              this.longitude = +this.context['longitude'];
	      console.log(this.latitude);
	      console.log(this.longitude);
              this.dataLoaded = Promise.resolve(true);
            }
          );
  }
  updateContext() {
     this.contextService.updateItem(this.context_id,this.context)
         .subscribe(
             data => {
                this.context = data as Observable<Context>;
                this.success = true;
                //this.router.navigate(['/view/'+this.context["id"]]);
                this.router.navigate(['/list/']);
	     },
             err => {
                console.log(err.error);
                this.success=false;
	        this.errorMessage=this.authService.getErrorMessage(err);
		}
            );
   }
  onSubmit(){
       this.updateContext();
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
  onEditButton(){
	  this.editMode = true;
	  if (this.authService.isLoggedIn()){
		  this.allowEdit = true;
		  this.showLoginMessage=false;
	  }else{
		  this.allowEdit=false;
		  this.showLoginMessage=true;
	  }
  }

}
