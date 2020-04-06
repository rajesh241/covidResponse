import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { debounceTime, merge, share, startWith, switchMap } from 'rxjs/operators';
import * as moment from "moment";

import { Page } from '../../pagination';
import { Entity } from "../../models/entity";
import { EntityService } from "../../services/entity.service";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router"

import {MatDialog, MatDialogConfig} from "@angular/material";
import { MarkerDialogComponent } from '../marker-dialog/marker-dialog.component';


// just an interface for type safety.
interface marker {
    latitude: number;
    longitude: number;
    label?: string;
    draggable: boolean;
    name?:string;
    is_active:boolean;
    icon_url:string;
}

const ZOOM_DEFAULT = 12;

@Component({
    selector: 'app-entity-search',
    templateUrl: './entity-search.component.html',
    styleUrls: ['./entity-search.component.css']
})
export class EntitySearchComponent implements OnInit {
    title: string = 'Entity Search';
    latitude: number;
    longitude: number;
    zoom:number;
    address: string;
    displayFilter:boolean=true;
    patch_data:any;
    private geoCoder;
    data: any = "Before Submit";

    // FIXME: 2nd Argument added for Angular 8
    @ViewChild('search', { static: true })
    public searchElementRef: ElementRef;
    @ViewChild('json', { static: true }) jsonElement?: ElementRef;
    public form: Object = {components: []};
    // Which format to show?
    located: boolean = true;
    // Radius
    radius = 5000;
    radiusLat = 0;
    radiusLong = 0;

    markers: marker[] = []
    filterForm: FormGroup;
    page: Observable<Page<Entity>>;
    pageUrl = new Subject<string>();
    success: boolean = false;
    dataLoaded: Promise<boolean>;
    recordTypes: any = [
     {
       name: "Crisis",
       value: "needHelp",
       img: "./assets/red-dot.png",
       selected: true
     },
     {
       name: "Relief",
       value: "facility",
       img: "./assets/green-dot.png",
       selected: true
     },
     {
       name: "Volunteer",
       value: "volunteer",
       img: "./assets/blue-dot.png",
       selected:"true"
     }
    ];
    constructor(
        private mapsAPILoader: MapsAPILoader,
        private entityService: EntityService,
        public authService: AuthService,
        private ngZone: NgZone,
        private dialog: MatDialog
    ) {
        this.filterForm = new FormGroup({
            latitude__gte : new FormControl(),
            longitude__gte : new FormControl(),
            latitude__lte : new FormControl(),
            longitude__lte : new FormControl(),
            record_type1 : new FormControl(),
            limit : new FormControl(5000),
            search: new FormControl()
        });
        this.createRecordTypeCheckbox(this.recordTypes);
        this.page = this.filterForm.valueChanges.pipe(
            debounceTime(200),
            startWith(this.filterForm.value),
            merge(this.pageUrl),
            switchMap(urlOrFilter => this.entityService.list(urlOrFilter)),
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
            switchMap(urlOrFilter => this.entityService.list(urlOrFilter)),
            share()
        );
        this.dataLoaded = Promise.resolve(true);
    }
    createRecordTypeCheckbox(recordTypeInputs) {
      recordTypeInputs.map(recordType => {
        this.filterForm.addControl(recordType.value, new FormControl(recordType.selected || false));
      });
    }
    ngOnInit() {
        console.log('Inside ngOnInit()')
        //load Places Autocomplete
        this.mapsAPILoader.load().then(() => {
            this.setCurrentLocation();
            this.geoCoder = new google.maps.Geocoder;

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
                    this.radiusLat = this.latitude;
                    this.radiusLong = this.longitude;
                    this.zoom = ZOOM_DEFAULT;
                });
            });
        });
    }

    // Get Current Location Coordinates
    private setCurrentLocation() {
        console.log('Inside setCurrentLocation()')
        if ('geolocation' in navigator) {
            console.log('geolocation found in navigator')
            navigator.geolocation.getCurrentPosition((position) => {
                console.log('Inside getCurrentLocation()')
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
                this.radiusLat = this.latitude;
                this.radiusLong = this.longitude;
                this.zoom = ZOOM_DEFAULT;
                this.getAddress(this.latitude, this.longitude);
                console.log(this.latitude, this.longitude, this.zoom);
                this.setMarkers();
            }, err => {
                console.log('Errored: ');
                console.log(err);  // FIXME on screen modal or display
            });
        }
        else {
            console.log("Geolocation is not supported by this browser.");
            alert("Geolocation is not supported by this browser.");
            this.latitude = 28.4720443;
            this.longitude = 77.1329417;
            this.radiusLat = this.latitude;
            this.radiusLong = this.longitude;
            this.zoom = ZOOM_DEFAULT;
            this.getAddress(this.latitude, this.longitude);
            console.log(this.latitude, this.longitude, this.zoom)
        }
    }

    setMarkers() {
        for(let i=1;i<50;i++){
            this.markers.push(
                {
                    latitude: this.latitude + Math.random()-0.5,
                    longitude: this.longitude + Math.random()-0.5,
                    label: '', //`${i}`,
                    draggable: false,
                    name: `Content no ${i}`,
                    is_active: true,
                    icon_url:'./assets/red-dot.png'
                }
            );
        }
        for(let i=50;i<100;i++){
            this.markers.push(
                {
                    latitude: this.latitude + Math.random()-0.5,
                    longitude: this.longitude + Math.random()-0.5,
                    label: '', //`${i}`,
                    draggable: false,
                    name: `Content no ${i}`,
                    is_active: true,
                    icon_url:'./assets/blue-dot.png'
                }
            );
        }
        for(let i=100;i<150;i++){
            this.markers.push(
                {
                    latitude: this.latitude + Math.random()-0.5,
                    longitude: this.longitude + Math.random()-0.5,
                    label: '', //`${i}`,
                    draggable: false,
                    name: `Content no ${i}`,
                    is_active: true,
                    icon_url:'./assets/green-dot.png'
                }
            );
        }
    }

    markerDragEnd($event: MouseEvent) {
        console.log($event);
        this.latitude = $event.coords.lat;
        this.longitude = $event.coords.lng;
        this.getAddress(this.latitude, this.longitude);
        this.radiusLat = this.latitude;
        this.radiusLong = this.longitude;
    }

    clickedMarker(marker) {
        console.log(marker);
        console.log(`clicked the marker: ${marker.name}`);
        this.openMarkerDialog(marker);
    }

    openMarkerDialog(marker) {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;

        dialogConfig.data = marker;

        this.dialog.open(MarkerDialogComponent, dialogConfig);
        
        const dialogRef = this.dialog.open(MarkerDialogComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(
            data => {
		    console.log("Dialog output:", data);
		    this.entityService.createFeedback({"entity":marker.id,"data_json":data})
                      .subscribe(
                        data1 => {
                                console.log('login success', data1);
                        },
                        err => {
                           console.log(err.error);
                          }
		      )
	     }
         );            
    }

    radiusDragEnd($event: any) {
        console.log($event);
        this.radiusLat = $event.coords.lat;
        this.radiusLong = $event.coords.lng;
        this.showHideMarkers();
    }

    event(type,$event) {
        console.log(type,$event);
        this.radius = $event;
        this.showHideMarkers();
    }

    showHideMarkers(){
        Object.values(this.markers).forEach(value => {
            value.is_active = true; // this.getDistanceBetween(value.lat,value.lng,this.radiusLat,this.radiusLong);
        });
    }

    getDistanceBetween(lat1,long1,lat2,long2){
        var from = new google.maps.LatLng(lat1,long1);
        var to = new google.maps.LatLng(lat2,long2);

        if(google.maps.geometry.spherical.computeDistanceBetween(from,to) <= this.radius){
            console.log('Radius',this.radius);
            console.log('Distance Between',google.maps.geometry.spherical.computeDistanceBetween(
                from,to
            ));
            return true;
        }else{
            return false;
        }
    }
    toggleFunctional(entity_id, is_functional, record_type){
	    console.log(entity_id);
	    console.log(is_functional);
	    is_functional = !is_functional;
	    if(is_functional){
		   if(record_type == "needHelp"){
		      this.patch_data = {'is_functional':1,'icon_url':'https://entityb.libtech.in/media/icons/red-dot.png'}
		   }else if(record_type == "facility"){
		      this.patch_data = {'is_functional':1,'icon_url':'https://entityb.libtech.in/media/icons/green-dot.png'}
		   }else{
		      this.patch_data = {'is_functional':1,'icon_url':'https://entityb.libtech.in/media/icons/blue-dot.png'}
		   }
	    }else{
		   this.patch_data = {'is_functional':0,'icon_url':'https://entityb.libtech.in/media/icons/gray-dot.png'}
	    }
	    console.log(this.patch_data);
            this.entityService.patchItem(entity_id,this.patch_data)
            .subscribe(
                data => {
			console.log("Update Success");
			this.loadpage();
	        },
                err => {
                   console.log("Update Failed");
	           }
               );
    }
    getAddress(latitude, longitude) {
        this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
            console.log(results);
            console.log(status);
            if (status === 'OK') {
                if (results[0]) {
                    this.zoom = ZOOM_DEFAULT;
                    this.address = results[0].formatted_address;
                } else {
                    window.alert('No results found');
                }
            } else {
                window.alert('Geocoder failed due to: ' + status);
            }
        });
    }
    onSubmit($event) {
        console.log($event);
        this.data = $event.data;
    }
    onChange(event) {
        console.log(event.form);
        this.data = (event.form)
    }
}
