import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { formioConfig } from '../../formio/config';

@Component({
    selector: 'app-survey',
    templateUrl: './survey.component.html',
    styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {
    formio_url: string;

    constructor(
        private activatedRoute:ActivatedRoute,
    ) { 
	console.log(`SurveyComponent.subscrition()`);
        this.activatedRoute.paramMap.subscribe(
            params => {
		console.log(`SurveyComponent.subscrition(${JSON.stringify(params)})`);
		this.formio_url = formioConfig.appUrl + '/forms/v1/' + params.get('id');
		console.log(`SurveyComponent.subscrition() => url: ${this.formio_url}`);
            }
        )
    }

    ngOnInit() {
    }

    onSubmit($event) {
	console.log(`SurveyComponent.onSubmit()`);
	console.log($event.data);
    }
}
