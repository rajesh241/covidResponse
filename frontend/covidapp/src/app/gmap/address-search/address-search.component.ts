import { Component, ViewChild, EventEmitter, Output, OnInit, AfterViewInit, Input, forwardRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-address-search',
    templateUrl: './address-search.component.html',
    styleUrls: ['./address-search.component.css'],
    providers: [
        {       provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => AddressSearchComponent),
                multi: true
        }
    ]
})
export class AddressSearchComponent implements OnInit, AfterViewInit, ControlValueAccessor {
    @Input() adressType: string;
    @Output() setAddress: EventEmitter<any> = new EventEmitter();
    // FIXME: 2nd Argument added for Angular 8
    @ViewChild('addresstext', { static: true }) addresstext: any;

    autocompleteInput: string;
    queryWait: boolean;

    constructor(private mapsAPILoader: MapsAPILoader) {
    }

    onChange: any = () => {};
    onTouch: any = () => {};
    location;

    set value(val){  // this value is updated by programmatic changes if( val !== undefined && this.val !== val){
        this.location = val;
        this.onChange(val);
        this.onTouch(val);
    }

    // this method sets the value programmatically
    writeValue(value: any){
        this.location = value;
    }
    // upon UI element value changes, this method gets triggered
    registerOnChange(fn: any){
        this.onChange = fn;
    }
    // upon touching the element, this method gets triggered
    registerOnTouched(fn: any){
        this.onTouch = fn;
    }

    ngOnInit() {
        // FIXME - Why is the MapsAPILoader not here
    }

    ngAfterViewInit() {
        this.mapsAPILoader.load().then(() => {
            const autocomplete = new google.maps.places.Autocomplete(
                this.addresstext.nativeElement, {
                    componentRestrictions: { country: 'IN' },
                    types: [] // [this.adressType]  // 'establishment' / 'address' / 'geocode'
                });
            google.maps.event.addListener(autocomplete, 'place_changed', () => {
                const place = autocomplete.getPlace();
                this.invokeEvent(place);
            });
        });
    }

    invokeEvent(place) {
        this.location = this.getLocation(place)
        this.onChange(this.location);
        //this.setAddress.emit(this.location);
    }

    getLocation(place) {
        console.log(`AddressSearchComponent.getlocation(${JSON.stringify(place.geometry.location)})`);
        return {
            'lat': place.geometry.location.lat(),
            'lng': place.geometry.location.lng(),
        };
    }
}
