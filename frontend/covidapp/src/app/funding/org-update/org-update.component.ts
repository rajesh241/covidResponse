import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { formioConfig } from '../../formio/config';
import { UserService } from "../../services/user.service";
import { Router } from "@angular/router"
import { Location } from '@angular/common';

@Component({
    selector: 'app-org-update',
    templateUrl: './org-update.component.html',
    styleUrls: ['./org-update.component.css']
})
export class OrgUpdateComponent implements OnInit {
    public dataLoaded: Promise<boolean>;
    public formio_url: string;
    private formio_tag = 'fundseekers';
    private user;
    public item$: any;
    private id: any;

    constructor(
        private userService:UserService,
	private router:Router,
	private location: Location,
        private activatedRoute:ActivatedRoute,
    ) { 
	console.log(`OrgUpdateComponent.constructor()`);
	this.user = localStorage.getItem('userid');
	this.formio_url = formioConfig.appUrl + '/forms/v1/' + this.formio_tag;
	console.log(`OrgCreateComponent.ngOnInit() => fromio_url[${this.formio_url}]`);
    }

    ngOnInit() {
	console.log(`OrgUpdateComponent.ngOnInit()`);

        this.activatedRoute.paramMap.subscribe(
            params => {
                this.id=Number(params.get("id"));
	        console.log(`OrgUpdateComponent.ngOnInit(): ID[${this.id}]`);
                this.item$ = this.userService.getOrg(this.id)
                this.dataLoaded = Promise.resolve(true);
            }
        )
    }

    onSubmit($event){
	console.log($event.data);

        this.userService.patchOrg(this.id, {'user': this.user, 'data_json': $event.data})
            .subscribe(
                data => {
                    setTimeout(() => {
		        this.location.back();
                    }, 1000);
	        }
            );
    }
}
