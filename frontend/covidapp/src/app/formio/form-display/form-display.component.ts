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
	this.facility_form_url = 'https://covid.libtech.in:/assets/form.json';
    }

    ngOnInit() {
    }

    onSubmit($event) {
        console.log($event);
        this.data = $event.data;
        console.log(this.data);
    }
}
