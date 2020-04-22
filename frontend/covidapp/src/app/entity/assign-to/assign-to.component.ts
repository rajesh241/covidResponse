import { Component, ViewChild, EventEmitter, Output, OnInit, Input, forwardRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Observable } from 'rxjs';
//import { map, debounceTime, merge, share, startWith, switchMap } from 'rxjs/operators';
import { switchMap, debounceTime, share, tap, finalize } from 'rxjs/operators';


import { Page } from '../../pagination';
import { EntityService } from "../../services/entity.service";
import { UserService } from "../../services/user.service";
import { PublicUser } from "../../models/publicuser";


@Component({
    selector: 'app-assign-to',
    templateUrl: './assign-to.component.html',
    styleUrls: ['./assign-to.component.css'],
    providers: [
        {       provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => AssignToComponent),
                multi: true
        }
    ]
})
export class AssignToComponent implements OnInit, ControlValueAccessor {
    @Input('volunteer') volunteer: string;
    //@Input('organization') organization: string;
    //@Output() setAddress: EventEmitter<any> = new EventEmitter();

    // FIXME: 2nd Argument added for Angular 8
    //@ViewChild('searchText', { static: true }) volText: any;
    @ViewChild('search', { static: true })
    // public searchElementRef: ElementRef;

    filteredUsers: Observable<PublicUser[]>;

    autocompleteInput: string;

    filterForm: FormGroup;
    isLoading: boolean = false;
    subscriber;

    constructor(
        private entityService: EntityService,
        private userService: UserService,
    ) {
        this.filterForm = new FormGroup({
            search: new FormControl()
        });

	this.subscriber = this.filterForm.valueChanges.pipe(
            debounceTime(300),
	    tap(() => this.isLoading = true),
	    switchMap(value => this.userService.search({name: value}, 1)
		      .pipe(
			  finalize(() => this.isLoading = false),
		      )
		     ),          
	    share()
	);
	this.subscriber.subscribe(users => this.filteredUsers = users.results);
    }

    onChange: any = () => {};
    onTouch: any = () => {};
    assignedTo = {
	'volunteer': '',
	'organization': '',
    };

    set value(val){  // this value is updated by programmatic changes if( val !== undefined && this.val !== val){
        this.assignedTo = val;
        this.onChange(val);
        this.onTouch(val);
    }

    // this method sets the value programmatically
    writeValue(value: any){
        this.assignedTo = value;
    }
    // upon UI element value changes, this method gets triggered
    registerOnChange(fn: any){
	console.log('AssignToComponent.registerOnChange()');
	// this.page.subscribe(fn);
        this.onChange = fn;
    }
    // upon touching the element, this method gets triggered
    registerOnTouched(fn: any){
        this.onTouch = fn;
    }

    ngOnInit() {
        // FIXME - Why is the MapsAPILoader not here
    	//this.users = this.userService.getAllUsersPublic();
	this.subscriber.subscribe(page => {
	    console.log(page);
	    this.invokeEvent(page);
	});
    }

    invokeEvent(val) {
	console.log(`AssignToComponent.invokeEvent(${val})`);
	console.log(val);
        this.assignedTo = val;
        this.onChange(this.assignedTo);
    }
}
