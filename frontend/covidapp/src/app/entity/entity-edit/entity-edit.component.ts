import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable } from "rxjs";
import { Entity } from "../../models/entity";
import { EntityService } from "../../services/entity.service";
import { AuthService } from "../../services/auth.service";
import { ActivatedRoute } from "@angular/router";
import {Router} from "@angular/router"
import { GeocodeService } from '../../services/geocode.service';
import { Location } from '../../models/location';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { formioConfig } from '../../formio/config';
@Component({
  selector: 'app-entity-edit',
  templateUrl: './entity-edit.component.html',
  styleUrls: ['./entity-edit.component.css']
})
export class EntityEditComponent implements OnInit {
  //entity : Observable<Entity>;
  entity : any;
  apt : Entity;
  entity_id: number;
  success: boolean=false; 
  errorMessage:string="";
  dataLoaded: Promise<boolean>;
  entity_loaded:boolean=false;
  address:string;
  location: Location;
  latitude:number = 25.444780;
  longitude:number = 81.843217
  loading: boolean;
  isVolunteer:boolean=false;
  editMode:boolean=false;
  allowEdit:boolean=false;
  showLoginMessage:boolean=false;
  json_pre: any;
  form_url = formioConfig.appUrl + '/data/helpseeker';
  constructor(private entityService:EntityService,
	      private authService:AuthService,
              private activatedRoute:ActivatedRoute,
              private geocodeService: GeocodeService,
              private ref: ChangeDetectorRef,
              private router: Router) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(
      params => {
         this.entity_id=Number(params.get("id"));
      }  
    )
    this.loadEntityData();

  }
 
  loadEntityData(){
    this.entityService.getItemPublic(this.entity_id)
         .subscribe(
            data => {
              this.entity = data;
	      console.log(data);
              this.json_pre = {
		      data : this.entity.data_json
	      }
	      if (this.entity['record_type'] == "needHelp"){
		      this.isVolunteer=false;
	      }else{
		      this.isVolunteer=true;
	      }
	      console.log("received data is " + this.entity['name']);
              this.latitude = +this.entity['latitude'];
              this.longitude = +this.entity['longitude'];
	      console.log(this.latitude);
	      console.log(this.longitude);
              this.dataLoaded = Promise.resolve(true);
            }
          );
  }
  updateEntity() {
     this.entityService.updateItem(this.entity_id,this.entity)
         .subscribe(
             data => {
                this.entity = data as Observable<Entity>;
                this.success = true;
                //this.router.navigate(['/view/'+this.entity["id"]]);
                this.router.navigate(['/list/']);
	     },
             err => {
                console.log(err.error);
                this.success=false;
	        this.errorMessage=this.authService.getErrorMessage(err);
		}
            );
   }
  onSubmit(event){
       this.updateEntity();
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
