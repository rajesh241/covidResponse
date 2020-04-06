import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-form-display',
    templateUrl: './form-display.component.html',
    styleUrls: ['./form-display.component.css']
})
export class FormDisplayComponent implements OnInit {
    title:string = 'Display the Facility Form'
    facility_form_url:string = "http://covid.libtech.in:8888/map/facility";
    data:any;

    constructor() { }

    ngOnInit() {
    }

    onSubmit($event) {
        console.log($event);
        this.data = $event.data;
        console.log(this.data);
    }
}
