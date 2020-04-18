import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router"

import { Observable, Subject } from 'rxjs';
import { map, debounceTime, merge, share, startWith, switchMap } from 'rxjs/operators';
import * as moment from "moment";

import { Page } from '../../pagination';
import { Entity } from "../../models/entity";
import { EntityService } from "../../services/entity.service";
import { AuthService } from "../../services/auth.service";

import { MatDialog, MatDialogConfig } from "@angular/material";
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { BulkDialogComponent } from '../bulk-dialog/bulk-dialog.component';

@Component({
    selector: 'app-entity-list',
    templateUrl: './entity-list.component.html',
    styleUrls: ['./entity-list.component.css']
})
export class EntityListComponent  {
    filterForm: FormGroup;
    page: Observable<Page<Entity>>;
    pageUrl = new Subject<string>();
    success: boolean = false;
    dataLoaded: Promise<boolean>;
    selectedEntities: any;
    checkState: boolean = false;
    entities: any;
    bulkAction: string = 'none';
    bulkActionList = [];
    selected = 'defunct';
    objectKeys = Object.keys;

    constructor(
        public authService: AuthService,
        private entityService: EntityService,
        private router:Router,      
        private dialog: MatDialog
    ) {
        this.filterForm = new FormGroup({
            limit : new FormControl(10),
            ordering : new FormControl('-updated'),
            search: new FormControl()
        });
        this.page = this.filterForm.valueChanges.pipe(
            debounceTime(200),
            startWith(this.filterForm.value),
            merge(this.pageUrl),
            switchMap(urlOrFilter => this.entityService.list(urlOrFilter)),
            share()
        );
        this.dataLoaded = Promise.resolve(true);

        this.page.subscribe(page => {
            this.entities = page.results;
	    this.checkState = false;
            delete this.selectedEntities;
	    this.selectedEntities = {};
	    console.log('Page Subscription');
	    //console.log(this.entities);
            this.bulkActionList = []
            this.entities.forEach( entity => {
                this.selectedEntities[entity.id] = this.checkState;
            });
        });
    }

    onPageChanged(url: string) {
        this.pageUrl.next(url);
    }

    loadpage(){
        console.log("Load page is getting executed")
        this.page = this.filterForm.valueChanges.pipe(
            debounceTime(200),
            startWith(this.filterForm.value),
            merge(this.pageUrl),
            switchMap(urlOrFilter => this.entityService.list(urlOrFilter)),
            share()
        );
        this.dataLoaded = Promise.resolve(true);
    }

    deleteEntity(id){
	this.entityService.deleteItem(id)
	    .subscribe(
		data => {
		    this.success=true;
		    this.loadpage();
		},
		error => console.log("could no delete" + error)
            )
    }

    deleteAllEntitys(){
        console.log("this will delete all entitys");
        this.entityService.bulkDeleteItems({'user_ids': ['all'] })
	    .subscribe(
		data => {
		    this.success=true;
		    this.loadpage();
		},
		error => console.log("could not delete" + error)
            )
    }

    public isUserManager(){
        return ( moment().isBefore(this.getExpiration()) && ( (this.getUserName() === "usermanager") || (this.getUserName() === "admin" )));
    }

    getUserName(){
        const username = localStorage.getItem("username");
        return username
    }

    getExpiration() {
        const expiration = localStorage.getItem("expires_at");
        const expiresAt = JSON.parse(expiration);
        return moment(expiresAt);
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

    allChecked() {
        console.log('EntityListComponent.allChecked()');
        //this.checkState = !this.checkState;
        this.entities.forEach( entity => {
            this.selectedEntities[entity.id] = this.checkState;
            this.bulkActionIntersection(entity);
        });
        if (!this.checkState) {
            delete this.bulkActionList;
            this.bulkActionList = [];
        }
        console.log(`Final ${JSON.stringify(this.bulkActionList)}`);
    }

    bulkActionIntersection(entity) {
        console.log('EntityListComponent.bulkActionIntersection()');
        let selectOptions = [];

        if (!this.selectedEntities[entity.id])
            return;
        console.log(entity.bulk_action_list);
        if (typeof this.bulkActionList !== 'undefined' && this.bulkActionList.length > 0) {
            // the array is defined and has at least one element
            console.log(`Before ${JSON.stringify(this.bulkActionList)}`);
            console.log(`Before ${JSON.stringify(entity.bulk_action_list)}`);
            // this.bulkActionList = this.bulkActionList.filter(item => {return item in entity.bulk_action_list;});

            for(let key in this.bulkActionList) {
                console.log(key, this.bulkActionList[key]);
                if (!(key in entity.bulk_action_list)) {
                    this.bulkActionList.splice(Number(key), 1);
                    console.log(`DELETION => ${JSON.stringify(this.bulkActionList)}`);
                }
            }
            console.log(`After ${JSON.stringify(this.bulkActionList)}`);
        }
        else
            this.bulkActionList = entity.bulk_action_list;

        if (!('none' in Object.keys(this.bulkActionList)))
            this.bulkActionList.push({'none': 'None'});
    }

    onCBChange(entity) {
        console.log('EntityListComponent.onCBChange()');
        this.bulkActionIntersection(entity);
        console.log(`Final ${JSON.stringify(this.bulkActionList)}`);
    }

    applyBulkAction() {
        console.log('EntityListComponent.applyBulkAction()');
        console.log(this.selectedEntities);
	let chosenEntites = [];

        this.entities.forEach(
	    entity => {
		if (this.selectedEntities[entity.id]) {
                    // this.bulkAction(entity);
		    chosenEntites.push(entity);
		}
            });
	
	if (this.authService.isLoggedIn()){ 
            const dialogConfig = new MatDialogConfig();

            dialogConfig.disableClose = true;
            dialogConfig.autoFocus = true;

            dialogConfig.data = {
		'entities': chosenEntites,
		'action': this.bulkAction,
		'json': '',
	    };

            const dialogRef = this.dialog.open(BulkDialogComponent, dialogConfig);

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
