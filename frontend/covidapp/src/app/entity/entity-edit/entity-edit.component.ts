import { Component, OnInit, Input, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Observable } from "rxjs";
import { Entity } from "../../models/entity";
import { EntityService } from "../../services/entity.service";
import { AuthService } from "../../services/auth.service";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router"
import { GeocodeService } from '../../services/geocode.service';
import { Location } from '../../models/location';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { formioConfig } from '../../formio/config';

const ZOOM_DEFAULT = 15;

@Component({
    selector: 'app-entity-edit',
    templateUrl: './entity-edit.component.html',
    styleUrls: ['./entity-edit.component.css']
})
export class EntityEditComponent implements OnInit {
    @Input('entity') entity: any;
    //entity : Observable<Entity>;
    data: any;
    prefill_json : any;
    formio_url: any;
    entity_id: number;
    success: boolean=false; 
    errorMessage:string="";
    dataLoaded: Promise<boolean>;
    entity_loaded:boolean=false;
    address:string;
    location: Location;
    latitude:number = 25.444780;
    longitude:number = 81.843217;
    loading: boolean;
    isVolunteer:boolean=false;
    editMode:boolean=false;
    allowEdit:boolean=false;
    showLoginMessage:boolean=false;
    data_json: any;
    form_url = formioConfig.appUrl + '/data/helpseeker';
    private gmap_details: any;
    zoom = ZOOM_DEFAULT;
    private geoCoder;
    
    // FIXME: 2nd Argument added for Angular 8
    @ViewChild('search', { static: true })
    public searchElementRef: ElementRef;

    constructor(
        private entityService:EntityService,
	private authService:AuthService,
        private activatedRoute:ActivatedRoute,
        private geocodeService: GeocodeService,
        private router: Router,
        private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone
    ) {
        console.log('Inside FormEditComponent.constructor()')
    }

    ngOnInit() {
        console.log('Inside FormEditComponent.ngOnInit()')
        if (!this.entity) {
            this.activatedRoute.paramMap.subscribe(
                params => {
                    this.entity_id=Number(params.get("id"));
                }
            )
            this.loadEntityData();
        }else{
		this.formio_url = this.entity['formio_url'];
                this.prefill_json = this.entity['prefill_json'];
	}
        //load Places Autocomplete 
        this.mapsAPILoader.load().then(() => {
            this.geoCoder = new google.maps.Geocoder;
            this.setCurrentLocation();

            let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {});
            autocomplete.addListener("place_changed", () => {
                this.ngZone.run(() => {
                    //get the place result
                    let place: google.maps.places.PlaceResult = autocomplete.getPlace();

                    //verify result
                    if (place.geometry === undefined || place.geometry === null) {
                        return;
                    }

                    //set latitude, longitude and zoom
                    this.latitude = place.geometry.location.lat();
                    this.longitude = place.geometry.location.lng();
                    this.zoom = ZOOM_DEFAULT;
                    this.getAddress(this.latitude, this.longitude); // FIXME - test this
                });
            });
        });
    }

    loadEntityData() {
        this.entityService.getItemPublic(this.entity_id)
            .subscribe(
                data => {
                    this.entity = data;
	            console.log(data);
                    this.data_json = this.prefill_json
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
	console.log("I am in update entity in entity edit component" + this.entity.id);
        this.entityService.patchItem(
            this.entity.id,
            {
                'latitude': this.latitude,
                'longitude': this.longitude,
                'data_json':this.data,
                'address':this.address,
                'google_location_json':this.gmap_details
            })
            .subscribe(
                data => {
                    this.entity = data as Observable<Entity>;
                    this.success = true;
                    //this.router.navigate(['/view/'+this.entity["id"]]);
                    this.router.navigate(['/list/']);
	        },
                err => {
                    this.success=false;
	            this.errorMessage="Unable to update";
		}
            );
    }

    onSubmit(event){
        this.data = event.data;
        this.updateEntity();
    }

    onEditButton() {
	this.editMode = true;
	if (this.authService.isLoggedIn()){
	    this.allowEdit = true;
	    this.showLoginMessage=false;
	}else{
	    this.allowEdit=false;
	    this.showLoginMessage=true;
	}
    }

    private setCurrentLocation() {
        console.log('Inside setCurrentLocation()')
        if (this.entity) {
            this.latitude = Number(this.entity.latitude);
            this.longitude = Number(this.entity.longitude);
            this.zoom = ZOOM_DEFAULT;
            this.getAddress(this.latitude, this.longitude);
            console.log(this.latitude, this.longitude, this.zoom)
        }
        else if (this.address != '' && 'geolocation' in navigator) {
            console.log('geolocation found in navigator')
            navigator.geolocation.getCurrentPosition((position) => {
                console.log('Inside getCurrentLocation()')
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
                this.zoom = 8;
                this.getAddress(this.latitude, this.longitude);
                console.log(this.latitude, this.longitude, this.zoom)
            }, function(e) {
                console.log('Errored: ')
                console.log(e)
            });
        }
        else {
            console.log("Geolocation is not supported by this browser.");
            // alert("Geolocation is not supported by this browser.");
            this.latitude = 28.4720443;
            this.longitude = 77.1329417;
            this.zoom = 15;
        }
    }

    markerDragEnd($event: MouseEvent) {
        console.log($event);
        this.latitude = $event.coords.lat;
        this.longitude = $event.coords.lng;   // FIXME - Goli check this.apt.lat/lng
        this.getAddress(this.latitude, this.longitude);
    }

    getAddress(latitude, longitude) {
        this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
            console.log(results);
            console.log(status);
            if (status === 'OK') {
                if (results[0]) {
                    this.zoom = ZOOM_DEFAULT;
                    this.address = results[0].formatted_address;
                    this.gmap_details = results[0];
                } else {
                    console.log('No results found');
                }
            } else {
                console.log('Geocoder failed due to: ' + status);
            }
        });
    }
}
