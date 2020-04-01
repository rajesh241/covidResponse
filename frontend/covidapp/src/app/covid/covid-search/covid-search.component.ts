import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { debounceTime, merge, share, startWith, switchMap } from 'rxjs/operators';
import * as moment from "moment";

import { Page } from '../../pagination';
import { Context } from "../../models/context";
import { ContextService } from "../../services/context.service";
import { AuthService } from "../../services/auth.service";
import {Router} from "@angular/router"

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
    selector: 'app-covid-search',
    templateUrl: './covid-search.component.html',
    styleUrls: ['./covid-search.component.css']
})
export class CovidSearchComponent implements OnInit {
    title: string = 'Covid Search';
    latitude: number;
    longitude: number;
    zoom:number;
    address: string;
    private geoCoder;

    // FIXME: 2nd Argument added for Angular 8
    @ViewChild('search', { static: false })
    public searchElementRef: ElementRef;

    // Which format to show?
    located: boolean = true;
    // Radius
    radius = 5000;
    radiusLat = 0;
    radiusLong = 0;

    markers: marker[] = []
    filterForm: FormGroup;
    page: Observable<Page<Context>>;
    pageUrl = new Subject<string>();
    success: boolean = false;
    dataLoaded: Promise<boolean>;

    constructor(
        private mapsAPILoader: MapsAPILoader,
        private contextService: ContextService,
        private ngZone: NgZone
    ) {
        this.filterForm = new FormGroup({
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
            switchMap(urlOrFilter => this.contextService.list(urlOrFilter)),
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
            switchMap(urlOrFilter => this.contextService.list(urlOrFilter)),
            share()
        );
        this.dataLoaded = Promise.resolve(true);
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

    clickedMarker(name: string, index: number) {
        console.log(`clicked the marker: ${name || index}`)
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
}
