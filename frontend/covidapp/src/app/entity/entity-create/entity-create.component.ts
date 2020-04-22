import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from "@angular/router"
import { ActivatedRoute } from "@angular/router";
import { formioConfig } from '../../formio/config';
import { EntityService } from "../../services/entity.service";
import { UserService } from "../../services/user.service";
import { PublicUser } from "../../models/publicuser";

@Component({
  selector: 'app-entity-create',
  templateUrl: './entity-create.component.html',
  styleUrls: ['./entity-create.component.css']
})
export class EntityCreateComponent implements OnInit {
    assignedTo;
  users : Observable<PublicUser[]>;
  form_type: string;
  form_url: string;
  prefill_json:any;
  dataLoaded: Promise<boolean>;
  constructor(
                private activatedRoute:ActivatedRoute,
                private entityService: EntityService,
                private userService: UserService,
                private router: Router
  
  ) { }

  ngOnInit() {
	this.prefill_json = {"data" : {"userGroup": "swan"}};
	this.users = this.userService.getAllUsersPublic();
        this.dataLoaded = Promise.resolve(true);
	//this.prefill_json = {"data" :{}};
        this.activatedRoute.paramMap.subscribe(
            params => {
                this.form_type=params.get("form");
                if (this.form_type == "supportnetwork"){
                    this.form_url = formioConfig.appUrl + '/forms/v1/supportnetwork';
                }else{
                    this.form_url = formioConfig.appUrl + '/forms/v1/helpseekers';
                }
            }
	);
	console.log(this.form_type);
  }

    onSubmit($event) {
        console.log(`Inside add-dialog onSubmit(${$event})`);
        console.log($event.data);
                    this.entityService.createItem({'name':'default', 'record_type':this.form_type, 'formio_url':this.form_url, 'data_json':$event.data})
                        .subscribe(
                            data => {
                                console.log('Entity Creattion Successful', data);
                            },
                            err => {
                                console.log("Entity Creation Failed");
                            }
                        );
    }
}
