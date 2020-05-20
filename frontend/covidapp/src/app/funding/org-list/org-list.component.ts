import { Component, OnInit, Inject } from '@angular/core';
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

import { MatDialog, MatDialogConfig, MatSnackBar } from "@angular/material";
import { BulkDialogComponent } from '../../entity/bulk-dialog/bulk-dialog.component';


@Component({
    selector: 'app-orgs-list',
    templateUrl: './org-list.component.html',
    styleUrls: ['./org-list.component.css']
})
export class OrgListComponent implements OnInit {
    public panelOpen: boolean = true;
    public dataLoaded: Promise<boolean>;
    public orgs: any;
    public page: any;
    pageUrl = new Subject<string>();
    public filterForm: FormGroup;
    // public page: Observable<Page<Entity>>;
    // private pageUrl = new Subject<string>();
    private rand_number:any;

    public selectedOrgs: any;
    public checkState: boolean = false;
    public showBulkActions: boolean = false;
    public bulkActionList = {
        'endorse': 'Endorse',
    };

    public isEndorsedOptions = [
        {'value': '1', 'name': 'Not Endorsed'},
        {'value': '0', 'name': 'Endorsed'}
    ];

    constructor(
        public authService: AuthService,
        private userService: UserService,
        private entityService: EntityService,
        private router:Router,
	private snackBar: MatSnackBar,
	@Inject(DOCUMENT) private document: Document,
        private dialog: MatDialog
    ) {
        console.log('OrgListComponent.constructor()');
        this.filterForm = new FormGroup({
            limit : new FormControl(10),
            ordering : new FormControl('-created'),
            //state: new FormControl(),
            //district: new FormControl(),
            endorsed__isnull:  new FormControl(),
            search: new FormControl(),
            dummy: new FormControl(),
        });

        this.page = this.filterForm.valueChanges.pipe(
            debounceTime(200),
            startWith(this.filterForm.value),
            merge(this.pageUrl),
            switchMap(urlOrFilter => this.userService.getOrgs(urlOrFilter)),
            share()
        );

        this.page.subscribe(
            data => {
                console.log('OrgListComponent.getOrgs()', data);
                this.orgs = data.results;
	        this.checkState = false;
                this.showBulkActions = false;
                delete this.selectedOrgs;
	        this.selectedOrgs = {};
                this.orgs.forEach(org => {
                    this.selectedOrgs[org.id] = this.checkState;
                });
                this.dataLoaded = Promise.resolve(true);
            },
        );
    }

    ngOnInit() {
        console.log('OrgListComponent.ngOnInit()');
    }

    onPageChanged(url: string) {
        this.pageUrl.next(url);
    }

    allChecked() {
        console.log('OrgListComponent.allChecked()');
        this.orgs.forEach( org => {
            this.selectedOrgs[org.id] = this.checkState;
        });
        this.showBulkActions = this.checkState;
    }

    onCBChange(org) {
        console.log('OrgListComponent.onCBChange()');
        this.showBulkActions = Object.values(this.selectedOrgs).some(e => e);
    }

    onBulkAction(action) {
        console.log(`OrgListComponent.applyBulkAction(${JSON.stringify(action)})`, action);
        //console.log(this.selectedOrgs);

	let chosenOrgs = [];

        this.orgs.forEach(
	    org => {
		if (this.selectedOrgs[org.id]) {
                    // this.bulkAction.Key(org);
		    chosenOrgs.push(org);
		}
            });
	
	if (this.authService.isLoggedIn()){ 
            const dialogConfig = new MatDialogConfig();

            dialogConfig.disableClose = true;
            dialogConfig.autoFocus = true;

            dialogConfig.data = {
		'entities': chosenOrgs, // Mynk - FIXME
		'action': action,
		'json': '',
	    };

            const dialogRef = this.dialog.open(BulkDialogComponent, dialogConfig);

            dialogRef.afterClosed().subscribe(
                data => {
		    let org_ids = new  Array();
		    var length;
		    let ids_json : any;
                    
                    if (!data)   // Close pressed without any action.key
                        return;

		    console.log(`OrgListComponent.onBulkAction().dialogRef.afterClosed()`, data);
                    // FIXME - This is alredy there - this.selectedOrgs[]
		    for (let org of data.entities) {
			//console.log("Printing org id " + org.id); // 1, "string", false
			org_ids.push(org.id)
		    }
		    console.log("Org Ids is " + org_ids);
		    ids_json = { "ids" : org_ids}
                    
                    this.entityService.createBulkOperation({
			'ids_json': ids_json,
			'bulk_action': data.action.key,
			'data_json': data.json
		    }).subscribe(
                        data => {
                            console.log('Bulk Operation Creattion Successful', data);
                            this.rand_number = Math.floor(Math.random()*(100)+0);
                            this.filterForm.controls.dummy.setValue(this.rand_number);
			    if (data['bulk_action']== 'export') {
			    this.snackBar.open('Your file will be downloaded shortly', action.value, {
				duration: 3000,
			    });
                              this.document.location.href = 'https://coast-india.s3.ap-south-1.amazonaws.com/export/selected/'+data["data_json"]["filename"];
			    }
                            else if (data['bulk_action']== 'assigntovolunteer') {
                                if (data['data_json']['assigntovolunteer'] === '')
			            this.snackBar.open('Submitted Successfuly', 'Unassign', {
				        duration: 3000,
			            });
                                else
			            this.snackBar.open('Submitted Successfuly', action.value, {
				        duration: 3000,
			            });
			    }
                            else if (data['bulk_action']== 'assigntogroup') {
                                if (data['data_json']['assigntogroup'] === '')
			            this.snackBar.open('Submitted Successfuly', 'Unassisnged', {
				        duration: 3000,
			            });
                                else
			            this.snackBar.open('Submitted Successfuly', action.value, {
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
                    //this.orgService.createItem({'name':'default','latitude': this.latitude, 'longitude': this.longitude, 'record_type':type})
                    this.orgService.createItem({'name':'default','latitude': this.latitude, 'longitude': this.longitude, 'record_type':type, 'data_json':data,'address':this.address,'google_location_json':this.gmap_details})
                    */
                }
            );
	}else{
            this.router.navigate(['/login']);
	}
    }
}
