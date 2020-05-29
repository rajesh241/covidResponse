import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from "@angular/router"

import { Observable, Subject } from 'rxjs';
import { map, debounceTime, merge, share, startWith, switchMap } from 'rxjs/operators';
import * as moment from "moment";

import { Page } from '../../pagination';
// import { Entity } from "../../models/entity";
// import { EntityService } from "../../services/entity.service";
import { AuthService } from "../../services/auth.service";
import { UserService } from "../../services/user.service";
import { EntityService } from "../../services/entity.service";

import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BulkDialogComponent } from '../../entity/bulk-dialog/bulk-dialog.component';

@Component({
    selector: 'app-request-list',
    templateUrl: './request-list.component.html',
    styleUrls: ['./request-list.component.css']
})
export class RequestListComponent implements OnInit, OnDestroy {
    public panelOpen: boolean = true;
    public dataLoaded: Promise<boolean>;
    public requests: any;
    public page: any;
    private pageUrl = new Subject<string>();
    private subscription;
    public filterForm: FormGroup;
    private rand_number:any;
    public selectedRequests: any;
    public checkState: boolean = false;
    public showBulkActions: boolean = false;
    public bulkActionList = {
        'pledge': 'Pledge',
    };

    constructor(
        public authService: AuthService,
        private userService: UserService,
        private entityService: EntityService,
        private router:Router,
	private snackBar: MatSnackBar,
	@Inject(DOCUMENT) private document: Document,
        private dialog: MatDialog
    ) {
        console.log('RequestListComponent.constructor()');
        this.filterForm = new FormGroup({
            limit : new FormControl(100),
            ordering : new FormControl('-created'),
            //state: new FormControl(),
            //district: new FormControl(),
            endorsed__isnull:  new FormControl(),
            amount_pending__gt:  new FormControl(0),
            search: new FormControl(),
            dummy: new FormControl(),
        });

        this.page = this.filterForm.valueChanges.pipe(
            debounceTime(200),
            startWith(this.filterForm.value),
            merge(this.pageUrl),
            switchMap(urlOrFilter => this.entityService.listRequest(urlOrFilter)),
            share()
        );
        this.dataLoaded = Promise.resolve(true); // To serialize subscribe only after share!
    }

    ngOnInit() {
        console.log('RequestListComponent.ngOnInit()');

        this.subscription = this.page.subscribe(
            data => {
                console.log('RequestListComponent.getRequests()', data);
                this.requests = data.results;
	        this.checkState = false;
                this.showBulkActions = false;
                delete this.selectedRequests;
	        this.selectedRequests = {};
                let now = new Date();
                this.requests.forEach(request => {
                    this.selectedRequests[request.id] = this.checkState;
                    let change = new Date(request.updated);
                    if(now.getTime()-change.getTime() < 5000)
                        request.recentlyUpdated = true;
                });
            },
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    onPageChanged(url: string) {
        this.pageUrl.next(url);
    }

    allChecked() {
        console.log('RequestListComponent.allChecked()');
        this.requests.forEach( request => {
            this.selectedRequests[request.id] = this.checkState;
        });
        this.showBulkActions = this.checkState;
    }

    onCBChange(request) {
        console.log('RequestListComponent.onCBChange()');
        this.showBulkActions = Object.values(this.selectedRequests).some(e => e);
    }

    onBulkActionFor(action_key, id) {
        this.selectedRequests[id] = true;
        let action = this.bulkActionList[action_key];
        console.log(`RequestListComponent.onBulkActionFor(${action_key}. ${id})`, action);
        this.onBulkAction({'key': action_key, 'value': action});
    }

    onBulkAction(action) {
        console.log(`RequestListComponent.applyBulkAction(${JSON.stringify(action)})`, action);
        //console.log(this.selectedRequests);

	let chosenRequests = [];

        this.requests.forEach(
	    request => {
		if (this.selectedRequests[request.id]) {
                    // this.bulkAction.Key(request);
		    chosenRequests.push(request);
		}
            });
	
	if (this.authService.isLoggedIn()){ 
            const dialogConfig = new MatDialogConfig();

            dialogConfig.disableClose = true;
            dialogConfig.autoFocus = true;

            dialogConfig.data = {
		'entities': chosenRequests, // Mynk - FIXME
		'action': action,
		'json': '',
	    };

            const dialogRef = this.dialog.open(BulkDialogComponent, dialogConfig);

            dialogRef.afterClosed().subscribe(
                data => {
		    let request_ids = new  Array();
		    var length;
		    let ids_json : any;
                    
                    if (!data)   // Close pressed without any action.key
                        return;

		    console.log(`RequestListComponent.onBulkAction().dialogRef.afterClosed()`, data);
                    // FIXME - This is alredy there - this.selectedRequests[]
		    for (let request of data.entities) {
			//console.log("Printing request id " + request.id); // 1, "string", false
			request_ids.push(request.id)
		    }
		    console.log("Request Ids is " + request_ids);
		    ids_json = { "ids" : request_ids}
                    
                    this.entityService.createBulkOperation({
			'ids_json': ids_json,
			'bulk_action': data.action.key,
			'data_json': data.json
		    }).subscribe(
                        data => {
                            console.log('Bulk Operation Creattion Successful', data);
                            this.rand_number = Math.floor(Math.random()*(100)+0);
                            this.filterForm.controls['dummy'].setValue(this.rand_number);
			    if (data['bulk_action']== 'pledge') {
			        this.snackBar.open('Pledge Submitted Successfully', action.value, {
				    duration: 3000,
			        });
			    }
                            else{
			        this.snackBar.open('Submitted Successfuly', action.value, {
				    duration: 3000,
			        });
			    }
                        },
                        err => {
                            console.log("Bulk Operation  Creation Failed");
			    this.snackBar.open('Bulk Action Failed!', action.value, {
				duration: 3000,
			    });
                        }
                    );
            	    //const replacer = (key, value) =>  String(value) === "null" || String(value) === "undefined" ? 0 : value; 
                    // data = JSON.parse( JSON.stringify(data, replacer));
                    console.log("Dialog output:", data);
                    /*
                    //this.requestService.createItem({'name':'default','latitude': this.latitude, 'longitude': this.longitude, 'record_type':type})
                    this.requestService.createItem({'name':'default','latitude': this.latitude, 'longitude': this.longitude, 'record_type':type, 'data_json':data,'address':this.address,'google_location_json':this.gmap_details})
                    */
                }
            );
	}else{
            this.router.navigate(['/login']);
	}
    }

    onExport(){
	    console.log("User has clicked export button");
	    this.document.location.href = 'https://coast-india.s3.ap-south-1.amazonaws.com/export/funding.csv';
    }
}
