//import { Component, OnInit } from '@angular/core';
import { Component, OnInit, Input, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Observable } from "rxjs";
import { Entity } from "../../models/entity";
import { EntityService } from "../../services/entity.service";
import { AuthService } from "../../services/auth.service";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router"

import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';

@Component({
    selector: 'app-entity-detail',
    templateUrl: './entity-detail.component.html',
    styleUrls: ['./entity-detail.component.css']
})
export class EntityDetailComponent implements OnInit {
    @Input('entity') entity: any;
    //entity : Observable<Entity>;
    data: any;
    prefill_json : any;
    entity_id: number;
    success: boolean=false; 
    errorMessage:string="";
    dataLoaded: Promise<boolean>;
    entity_loaded:boolean=false;
    address:string;
    location: Location;
    latitude:number = 25.444780;
    longitude:number = 81.843217;
    loading: boolean;
    isVolunteer:boolean=false;
    editMode:boolean=false;
    allowEdit:boolean=false;
    showLoginMessage:boolean=false;
    data_json: any;

    constructor(
        private entityService:EntityService,
	public authService:AuthService,
        private activatedRoute:ActivatedRoute,
        private router: Router,
        private dialog: MatDialog
    ) {
        console.log('Inside FormEditComponent.constructor()')
    }

    ngOnInit() {
        console.log('Inside FormEditComponent.ngOnInit()')
        this.activatedRoute.paramMap.subscribe(
            params => {
                this.entity_id=Number(params.get("id"));
            }
        )
        this.loadEntityData();
    }

    loadEntityData() {
        this.entityService.getItemPublic(this.entity_id)
            .subscribe(
                data => {
                    this.entity = data;
	            console.log(data);
                    this.data_json = this.prefill_json
	            if (this.entity['record_type'] == "needHelp"){
		        this.isVolunteer=false;
	            }else{
		        this.isVolunteer=true;
	            }
	            console.log("received data is " + this.entity['name']);
                    this.latitude = +this.entity['latitude'];
                    this.longitude = +this.entity['longitude'];
	            console.log(this.latitude);
	            console.log(this.longitude);
                    this.dataLoaded = Promise.resolve(true);
                }
            );
    }

    onEditButton() {
	this.editMode = true;
	if (this.authService.isLoggedIn()){
	    this.allowEdit = true;
	    this.showLoginMessage=false;
	}else{
	    this.allowEdit=false;
	    this.showLoginMessage=true;
	}
    }

    editDialog(entity) {
        console.log(`Inside EntityListComponent.editDialog(${JSON.stringify(entity)})`);
        console.log(entity);
	if (this.authService.isLoggedIn()){ 
            const dialogConfig = new MatDialogConfig();

            dialogConfig.disableClose = true;
            dialogConfig.autoFocus = true;

            dialogConfig.data = entity;

            const dialogRef = this.dialog.open(EditDialogComponent, dialogConfig);

            dialogRef.afterClosed().subscribe(
                data => {
            	    //const replacer = (key, value) =>  String(value) === "null" || String(value) === "undefined" ? 0 : value; 
                    // data = JSON.parse( JSON.stringify(data, replacer));
                    console.log("Dialog output:", data);
                    /*
                    //this.entityService.createItem({'name':'default','latitude': this.latitude, 'longitude': this.longitude, 'record_type':type})
                    this.entityService.createItem({'name':'default','latitude': this.latitude, 'longitude': this.longitude, 'record_type':type, 'data_json':data,'address':this.address,'google_location_json':this.gmap_details})
                    .subscribe(
                    data => {
                    console.log('Entity Creattion Successful', data);
                    },
                    err => {
                    console.log("Entity Creation Failed");
                    }
                    );
                    */
                }
            );
	}else{
            this.router.navigate(['/login']);
	}
    }
}
