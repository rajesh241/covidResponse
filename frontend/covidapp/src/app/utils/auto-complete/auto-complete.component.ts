//import { Component, ViewChild, EventEmitter, Output, OnInit, AfterViewInit, Input, forwardRef } from '@angular/core';
import { Component, Inject, Input, OnInit, forwardRef } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Observable } from 'rxjs';
import { map, startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { UserService } from "../../services/user.service";

@Component({
    selector: 'app-auto-complete',
    templateUrl: './auto-complete.component.html',
    styleUrls: ['./auto-complete.component.css'],
    providers: [
        {       provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => AutoCompleteComponent),
                multi: true
        }
    ]
})
export class AutoCompleteComponent implements OnInit {
    @Input() subscript: boolean = false;
    @Input() debug: boolean = false;
    @Input() desc: string = 'Choose the assignee';
    @Input() items: any[];

    //public items: any[];
    public acControl = new FormControl();
    public filteredOptions: Observable<any[]>;
    public result;

    constructor(
        private userService: UserService
    ) {
        // console.log(`AutoCompleteComponent.constructor(${this.subscript})`, this.desc, this.subscript);
    }

    onChange: any = () => {};
    onTouch: any = () => {};

    set value(val){  // this value is updated by programmatic changes if( val !== undefined && this.val !== val){
        this.result = val;
        this.onChange(val);
        this.onTouch(val);
    }

    // this method sets the value programmatically
    writeValue(value: any){
        this.result = value;
    }
    // upon UI element value changes, this method gets triggered
    registerOnChange(fn: any){
        this.onChange = fn;
    }
    // upon touching the element, this method gets triggered
    registerOnTouched(fn: any){
        this.onTouch = fn;
    }

    private _filter(value) {
        /*
        if (value === '') {
            this.onChange(value.id);
            return this.items;
        }
        */
        //console.log(`AutoCompleteComponent._filter(${JSON.stringify(value)})`, this.subscript, typeof(this.subscript));
        let res = this.subscript? value.id :value.name;
        if (typeof(value) == 'object') {
            //this.result = value;  // FIXME whys is this.result not uptdated?
            // this.onChange(value.id);
            // console.log(`AutoCompleteComponent._filter() => ${res}`);
            this.onChange(res);
            return [value];
        }

        
        const filterValue = value.toLowerCase();
        return this.items.filter(
            option => (option.name? option.name.toLowerCase().includes(filterValue): false) ||
                                 (this.subscript? String(option.id) == filterValue : false)
        );
    }

    ngOnInit() {
        // console.log(`AutoCompleteComponent.ngOnInit(${JSON.stringify(this.items)})`);
        /*
        this.userService.getAllUsersPublic(localStorage.getItem('usergroup'))
            .subscribe(
                data => {
                    console.log(' success', data);
                    this.items = data.results;
                    console.log('AutoCompleteComponent.userSubscribe()');
                    console.log(this.items);
                    // this.dataLoaded = Promise.resolve(true);
                },
                err => {
                    console.log("Failed");
                    // this.dataLoaded = Promise.resolve(false);
                }
            );
        */
        this.filteredOptions = this.acControl.valueChanges.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            startWith(''),
            map(value => this._filter(value))
        );
    }

    public acDisplay(option) {
        //let value = option? (this.subscript? `${option.name} | ${option.id}`: option.name): undefined;
        // console.log(`AutoCompleteComponent.displayAutoComplete(${JSON.stringify(option)})`, value, this.subscript, this.desc);
        // return value; // this not accessible here FIXME
        return option? option.name: undefined;
    }

    public acClear() {
        this.onChange('');
        this.acControl.setValue('');
    }
}
