import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-covid-home',
    templateUrl: './covid-home.component.html',
    styleUrls: ['./covid-home.component.css']
})
export class CovidHomeComponent implements OnInit {
    showMap: Boolean = true;
    relief: Number = 943;
    volunteers: Number = 102;
    crisis: Number = 450;
    constructor() {
    }

    ngOnInit() {
    }
}
