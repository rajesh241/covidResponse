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
    public formio_url: string;
    private formio_tag;
    private user;

    constructor(
        private entityService: EntityService,
	private location: Location,
        private userService: UserService
    ) {
	console.log(`RequestCreateComponent.constructor()`);
	this.user = localStorage.getItem('userid');
    }

    ngOnInit() {
	console.log(`RequestCreateComponent.ngOnInit()`);

	let current_url = window.location.href;
	this.formio_tag = /#\/(.+)/.exec(window.location.href)[1]
	this.formio_url = formioConfig.appUrl + '/forms/v1/' + this.formio_tag;
	console.log(`RequestCreateComponent.ngOnInit() => fromio_url[${this.formio_url}]`);
    }

    onSubmit($event) {
        console.log(`RequestCreateComponent.onSubmit(${$event})`);
        console.log($event.data);
        if (this.formio_tag == 'supportrequest') {
            this.entityService.createRequest({'user': this.user, 'data_json': $event.data})
            .subscribe(
                data => {
                    console.log('RequestCreateComponent|Entity Creatton Successful', data);
		    setTimeout(() => {
			this.location.back();
		    }, 1000);
                },
                err => {
                    console.log('RequestCreateComponent|Entity Creation Failed');
                }
            );
        }
        else { // fundseekers
            console.log(`RequestCreateComponent.onSubmit()|orgCreate(${this.formio_tag})`);
            this.userService.orgCreate({'user': this.user, 'data_json': $event.data})
                .subscribe(
                    data => {
                        console.log('RequestCreateComponent|Entity Creatton Successful', data);
		        setTimeout(() => {
			    this.location.back();
		        }, 1000);
                    },
                    err => {
                        console.log('RequestCreateComponent|Entity Creation Failed');
                    }
                );
        }
    }
}
