import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { formioConfig } from '../../formio/config';
import { EntityService } from "../../services/entity.service";

@Component({
  selector: 'app-entity-update',
  templateUrl: './entity-update.component.html',
  styleUrls: ['./entity-update.component.css']
})
export class EntityUpdateComponent implements OnInit {
    entity : any;
    dataLoaded: Promise<boolean>;
    entity_id: any;
    success: boolean=false;
    errorMessage:any;
    archives:any;
    constructor(
        private entityService:EntityService,
        private activatedRoute:ActivatedRoute,
    ) { 
        this.activatedRoute.paramMap.subscribe(
            params => {
                this.entity_id=Number(params.get("id"));
            }
        )
        this.loadEntityData();
    }

    ngOnInit() {
    }

    loadHistory(){
	   
        this.entityService.getAllHistory(this.entity_id)
            .subscribe(
                data => {
                    this.archives = data.results;
                    this.dataLoaded = Promise.resolve(true);
                }
            );

    }
    loadEntityData() {
        this.entityService.getItemPublic(this.entity_id)
            .subscribe(
                data => {
                    this.entity = data;
	            console.log(data);
		    this.loadHistory()
                }
            );
    }
    onSubmit($event){
	console.log($event.data);

        this.entityService.patchItem(this.entity.id, {'data_json':$event.data})
            .subscribe(
                data => {
                    this.success = true;
	        },
                err => {
                    this.success=false;
	            this.errorMessage="Unable to update";
		}
            );
    }

}
