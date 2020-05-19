import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { formioConfig } from '../../formio/config';
import { EntityService } from "../../services/entity.service";
import { UserService } from "../../services/user.service";
import { PublicUser } from "../../models/publicuser";
import { Location } from '@angular/common';

@Component({
    selector: 'app-request-create',
    templateUrl: './request-create.component.html',
    styleUrls: ['./request-create.component.css']
})
export class RequestCreateComponent implements OnInit {
    users : Observable<PublicUser[]>;
    form_type: string;
    form_url: string;
    prefill_json:any;
    usergroup:any;

    constructor(
        private entityService: EntityService,
	private location: Location,
        private userService: UserService
    ) {
	this.usergroup = localStorage.getItem('usergroup');
    }

    ngOnInit() {
	console.log(`RequestCreateComponent.ngOnInit()`);
	this.prefill_json = {"data" : {"userGroup": "swan"}};
	this.users = this.userService.getAllUsersPublic(this.usergroup);

	let current_url = window.location.href;
	let formio_tag = /#\/(.+)/.exec(window.location.href)[1]
	this.form_url = formioConfig.appUrl + '/forms/v1/' + formio_tag;
	console.log(`RequestCreateComponent.ngOnInit() => fromio_url[${this.form_url}]`);
    }

    onSubmit($event) {
        console.log(`RequestCreateComponent.onSubmit(${$event})`);
        console.log($event.data);
        /*
        this.entityService.createItem({'name':'default', 'record_type':this.form_type, 'formio_url':this.form_url, 'data_json':$event.data})
            .subscribe(
                data => {
                    console.log('Entity Creattion Successful', data);
		    setTimeout(() => {
			//  this.router.navigate(['/list/']);
			this.location.back();
		    }, 1000);
                },
                err => {
                    console.log("Entity Creation Failed");
                }
            );
        */
    }
}
