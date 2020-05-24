import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from "@angular/router"

import { Observable, Subject } from 'rxjs';
import { map, debounceTime, merge, share, startWith, switchMap } from 'rxjs/operators';
import * as moment from "moment";

import { Page } from '../../pagination';
import { AuthService } from "../../services/auth.service";
import { UserService } from "../../services/user.service";
import { EntityService } from "../../services/entity.service";

import { MatDialog, MatDialogConfig, MatSnackBar } from "@angular/material";
import { BulkDialogComponent } from '../../entity/bulk-dialog/bulk-dialog.component';

@Component({
    selector: 'app-pledge-list',
    templateUrl: './pledge-list.component.html',
    styleUrls: ['./pledge-list.component.css']
})
export class PledgeListComponent implements OnInit {
    public panelOpen: boolean = true;
    public dataLoaded: Promise<boolean>;
    public pledges: any;
    public page: any;
    pageUrl = new Subject<string>();
    public filterForm: FormGroup;
    private rand_number:any;
    public selectedPledges: any;
    public checkState: boolean = false;
    public showBulkActions: boolean = false;
    public bulkActionList = {
        'need': 'Do we need any?',
    };
    tab;
    tabIndex;
    tabList = [
	{'key': 'all', 'name': 'All', 'selected': false, 'class': 'fa-arrows-alt', 'color': 'green'},
	{'key': 'org', 'name': 'Pledged to My Org', 'selected': false, 'class': 'fa-group', 'color': 'brown'},
	{'key': 'mine', 'name': 'Pledged by Me', 'selected': false, 'class': 'fa-user', 'color': 'purple'},
        //	{'key': 'region', 'name': 'My Region', 'selected': false, 'class': 'fa-map-marker', 'color': 'red'},
    ];

    private user;
    private org;

    constructor(
        public authService: AuthService,
        private userService: UserService,
        private entityService: EntityService,
        private router:Router,
	private snackBar: MatSnackBar,
	@Inject(DOCUMENT) private document: Document,
        private dialog: MatDialog
    ) {
        console.log('PledgeListComponent.constructor()');
        this.org = localStorage.getItem('orgid');
        this.user = localStorage.getItem('userid');

        this.filterForm = new FormGroup({
            limit : new FormControl(100),
            ordering : new FormControl('-created'),
            //state: new FormControl(),
            //district: new FormControl(),
            endorsed__isnull:  new FormControl(),
            search: new FormControl(),
            dummy: new FormControl(),
            user__id: new FormControl(),
            user__organization__id: new FormControl()
        });

        /*
        // Set the tab to Assigned to me for all before subscribing
        if (this.user_role == 'volunteer')
            this.tab = 'mine';
        else if(this.user_role == 'groupadmin')
            this.tab = 'team';
        else
            this.tab = 'all';
        this.tabIndex = this.tabList.findIndex(e => e.key === this.tab);
        console.log('EntityListComponent.constructor()', this.tabIndex);
        this.onTabSelect();
        */

        this.page = this.filterForm.valueChanges.pipe(
            debounceTime(200),
            startWith(this.filterForm.value),
            merge(this.pageUrl),
            switchMap(urlOrFilter => this.entityService.pledgeList(urlOrFilter)),
            share()
        );

        this.page.subscribe(
            data => {
                console.log('PledgeListComponent.getPledges()', data);
                this.pledges = data.results;
	        this.checkState = false;
                this.showBulkActions = false;
                delete this.selectedPledges;
	        this.selectedPledges = {};
                this.pledges.forEach(pledge => {
                    this.selectedPledges[pledge.id] = this.checkState;
                });
                this.dataLoaded = Promise.resolve(true);
            },
        );
    }

    ngOnInit() {
        console.log('PledgeListComponent.ngOnInit()');
    }

    onPageChanged(url: string) {
        this.pageUrl.next(url);
    }

    allChecked() {
        console.log('PledgeListComponent.allChecked()');
        this.pledges.forEach( pledge => {
            this.selectedPledges[pledge.id] = this.checkState;
        });
        this.showBulkActions = this.checkState;
    }

    onCBChange(pledge) {
        console.log('PledgeListComponent.onCBChange()');
        this.showBulkActions = Object.values(this.selectedPledges).some(e => e);
    }

    onBulkActionFor(action_key, id) {
        this.selectedPledges[id] = true;
        let action = this.bulkActionList[action_key];
        console.log(`PledgeListComponent.onBulkActionFor(${action_key}. ${id})`, action);
        this.onBulkAction({'key': action_key, 'value': action});
    }

    onBulkAction(action) {
        console.log(`PledgeListComponent.applyBulkAction(${JSON.stringify(action)})`, action);
        //console.log(this.selectedPledges);

	let chosenPledges = [];

        this.pledges.forEach(
	    pledge => {
		if (this.selectedPledges[pledge.id]) {
                    // this.bulkAction.Key(pledge);
		    chosenPledges.push(pledge);
		}
            });
	
	if (this.authService.isLoggedIn()){ 
            const dialogConfig = new MatDialogConfig();

            dialogConfig.disableClose = true;
            dialogConfig.autoFocus = true;

            dialogConfig.data = {
		'entities': chosenPledges, // Mynk - FIXME
		'action': action,
		'json': '',
	    };

            const dialogRef = this.dialog.open(BulkDialogComponent, dialogConfig);

            dialogRef.afterClosed().subscribe(
                data => {
		    let pledge_ids = new  Array();
		    var length;
		    let ids_json : any;
                    
                    if (!data)   // Close pressed without any action.key
                        return;

		    console.log(`PledgeListComponent.onBulkAction().dialogRef.afterClosed()`, data);
                    // FIXME - This is alredy there - this.selectedPledges[]
		    for (let pledge of data.entities) {
			//console.log("Printing pledge id " + pledge.id); // 1, "string", false
			pledge_ids.push(pledge.id)
		    }
		    console.log("Pledge Ids is " + pledge_ids);
		    ids_json = { "ids" : pledge_ids}
                    
                    this.entityService.createBulkOperation({
			'ids_json': ids_json,
			'bulk_action': data.action.key,
			'data_json': data.json
		    }).subscribe(
                        data => {
                            console.log('Bulk Operation Creattion Successful', data);
                            this.rand_number = Math.floor(Math.random()*(100)+0);
                            this.filterForm.controls['dummy'].setValue(this.rand_number);
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
                    console.log("Dialog output:", data);
                }
            );
	}else{
            this.router.navigate(['/login']);
	}
    }

    resetTabFilters() {
        console.log(`EntityListComponent.resetTabFilters()`);
        this.filterForm.controls.user__id.setValue('');
        this.filterForm.controls.user__organization__id.setValue('');
    }

    onTabSelect($event=null) {
        if($event) {
            console.log('PledgeListComponent.onTabSelect()', $event);
            this.tab = this.tabList[$event.index].key
        }
        console.log('PledgeListComponent.onTabSelect()', this.tab);

        if(this.tab == 'mine') {
            console.log(`PledgeListComponent.onTabSelect(): Filtering by User[${this.user}]`);
            this.resetTabFilters();
            this.filterForm.controls.user__id.setValue(this.user);
        }
        else if (this.tab == 'team') {
            console.log(`PledgeListComponent.onTabSelect(): Filtering by Team[${this.org}]`);
            this.resetTabFilters();
            this.filterForm.controls.user__organization__id.setValue(this.org);
        }
        else {
            console.log(`PledgeListComponent.onTabSelect(): Not Filtering`);
            this.resetTabFilters();
        }
    }

    onExport(){
	    console.log("User has clicked export button");
	    this.document.location.href = 'https://coast-india.s3.ap-south-1.amazonaws.com/export/funding.csv';
    }
}
