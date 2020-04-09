import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-form-display',
    templateUrl: './form-display.component.html',
    styleUrls: ['./form-display.component.css']
})
export class FormDisplayComponent implements OnInit {
    title:string = 'Display the Facility Form'
    facility_form_url:string = 'http://covid.libtech.in:8888/forms/supportnetwork';
    data:any;

    constructor() {
        console.log('Inside form-dialog constructor()');
	//this.facility_form_url = 'https://covid.libtech.in:/assets/form.json';
	this.facility_form_url = window.origin + "/assets/forms/form.json";
        console.log(`The Facility Form URL[${this.facility_form_url}]`);
    }

    ngOnInit() {
        console.log('Inside form-dialog ngOnInit()');
    }

    onSubmit($event) {
        console.log($event);
        this.data = $event.data;
        console.log(this.data);
    }
}
