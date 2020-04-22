import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router"
import { ActivatedRoute } from "@angular/router";
import { formioConfig } from '../../formio/config';
import { EntityService } from "../../services/entity.service";

@Component({
  selector: 'app-entity-create',
  templateUrl: './entity-create.component.html',
  styleUrls: ['./entity-create.component.css']
})
export class EntityCreateComponent implements OnInit {

  form_type: string;
  form_url: string;
  constructor(
                private activatedRoute:ActivatedRoute,
                private entityService: EntityService,
                private router: Router
  
  ) { }

  ngOnInit() {
        this.activatedRoute.paramMap.subscribe(
            params => {
                this.form_type=params.get("form");
            }
	);
	console.log(this.form_type);
	if (this.form_type == "supportnetwork"){
	    //this.form_url = 'https://formio.libtech.in/forms/supportnetwork';
	    this.form_url = formioConfig.appUrl + '/forms/v1/supportnetwork';
	}else{
	    //this.form_url = 'https://formio.libtech.in/data/helpseeker';
	    this.form_url = formioConfig.appUrl + '/forms/v1/helpseekers';
	}
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
