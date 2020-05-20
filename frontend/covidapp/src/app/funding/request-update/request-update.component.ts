import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { formioConfig } from '../../formio/config';
import { EntityService } from "../../services/entity.service";
import { Router } from "@angular/router"
import { Location } from '@angular/common';

@Component({
    selector: 'app-request-update',
    templateUrl: './request-update.component.html',
    styleUrls: ['./request-update.component.css']
})
export class RequestUpdateComponent implements OnInit {
    public dataLoaded: Promise<boolean>;
    public formio_url: string;
    private formio_tag = 'supportrequest';
    private user;
    public item$: any;
    private id: any;

    constructor(
        private entityService:EntityService,
	private router:Router,
	private location: Location,
        private activatedRoute:ActivatedRoute,
    ) { 
	console.log(`RequestUpdateComponent.constructor()`);
	this.user = localStorage.getItem('userid');
	this.formio_url = formioConfig.appUrl + '/forms/v1/' + this.formio_tag;
	console.log(`RequestCreateComponent.ngOnInit() => fromio_url[${this.formio_url}]`);
    }

    ngOnInit() {
	console.log(`RequestUpdateComponent.ngOnInit()`);

        this.activatedRoute.paramMap.subscribe(
            params => {
                this.id=Number(params.get("id"));
	        console.log(`RequestUpdateComponent.ngOnInit(): ID[${this.id}]`);
                this.item$ = this.entityService.getRequest(this.id)
                this.dataLoaded = Promise.resolve(true);
            }
        )
    }

    onSubmit($event){
	console.log($event.data);

        this.entityService.patchRequest(this.id, {'user': this.user, 'data_json': $event.data})
            .subscribe(
                data => {
                    setTimeout(() => {
		        this.location.back();
                    }, 1000);
	        }
            );
    }
}
