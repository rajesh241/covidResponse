/// <reference types="@types/googlemaps" />
import { Component, ViewChild, EventEmitter, Output, OnInit, AfterViewInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
//import { } from '@types/googlemaps';  FIXME - what is line no 1? 
import { MapsAPILoader, MouseEvent } from '@agm/core';

@Component({
    selector: 'app-address-search',
    templateUrl: './address-search.component.html',
    styleUrls: ['./address-search.component.css']
})
export class AddressSearchComponent implements OnInit, AfterViewInit {
    @Input() adressType: string;
    @Output() setAddress: EventEmitter<any> = new EventEmitter();
    // FIXME: 2nd Argument added for Angular 8
    @ViewChild('addresstext', { static: true }) addresstext: any;

    autocompleteInput: string;
    queryWait: boolean;

    constructor() {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.getPlaceAutocomplete();
    }

    private getPlaceAutocomplete() {
        const autocomplete = new google.maps.places.Autocomplete(
            this.addresstext.nativeElement, {
                componentRestrictions: { country: 'US' },
                types: [] // [this.adressType]  // 'establishment' / 'address' / 'geocode'
            });
        google.maps.event.addListener(autocomplete, 'place_changed', () => {
            const place = autocomplete.getPlace();
            this.invokeEvent(place);
        });
    }

    invokeEvent(place: Object) {
        this.setAddress.emit(place);
    }
}
