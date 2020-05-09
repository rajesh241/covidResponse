import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router"

import { Observable, Subject } from 'rxjs';
import { map, debounceTime, merge, share, startWith, switchMap } from 'rxjs/operators';
import * as moment from "moment";

import { Page } from '../../pagination';
import { Entity } from "../../models/entity";
import { EntityService } from "../../services/entity.service";
import { AuthService } from "../../services/auth.service";
import { UserService } from "../../services/user.service";
import { DownloadService } from "../../services/download.service";

import { MatDialog, MatDialogConfig, MatSnackBar } from "@angular/material";
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { BulkDialogComponent } from '../bulk-dialog/bulk-dialog.component';
import { Location } from '@angular/common';

@Component({
    selector: 'app-entity-list',
    templateUrl: './entity-list.component.html',
    styleUrls: ['./entity-list.component.css']
})
export class EntityListComponent  {
    rand_number:any;
    usergroup:any;
    private groupID:any;
    private userID:any;
    user_role:any;
    showAddressBar: boolean = false;
    filterForm: FormGroup;
    page: Observable<Page<Entity>>;
    pageUrl = new Subject<string>();
    success: boolean = false;
    dataLoaded: Promise<boolean>;
    selectedEntities: any;
    checkState: boolean = false;
    entities: any;
    states: any;
    districts: any;
    groups:any;
    users:any;
    bulkAction: string = 'none';
    bulkActionList = {};
    panelOpen = true;
    isAssignedOptions = [
        {'value': '1', 'name': 'Unassigned'},
        {'value': '0', 'name': 'Assigned'}
    ];
    statusOptions = [
        {'value': 'to_call', 'name': 'To Call'},
        {'value': 'assign_to_volunteer', 'name': 'Assign To Volunteer'},
        {'value': 'assign_to_org', 'name': 'Assign to Org'},
        {'value': 'followup', 'name': 'Follow Up'},
        {'value': 'closed', 'name': 'Closed'}
    ];
    recordTypeOptions = [
        {'value': 'helpseekers', 'name': 'Help Seekers'},
        {'value': 'supportnetwork', 'name': 'Organization/NGO/Help Provider'},
        {'value': 'facility', 'name': 'Government Facilities'}
    ];
    urgencyOptions = [
        {'value': 'low', 'name':  'Low'},
        {'value': 'medium', 'name':  'Medium'},
        {'value': 'high', 'name':  'High'},
        {'value': 'not-needed', 'name':  'Not Needed'},
    ];
    helpOptions = [
	{'value': 'cash', 'name': 'Cash', 'selected': false, 'class': 'fa-money', 'color': 'green'},
	{'value': 'water', 'name': 'Water', 'selected': false, 'class': 'fa-tint', 'color': 'lightblue'},
	{'value': 'dryRations', 'name': 'Dry Rations', 'selected': false, 'class': 'fa-pagelines', 'color': 'brown'},
	{'value': 'cookedFood', 'name': 'Cooked Food', 'selected': false, 'class': 'fa-cutlery', 'color': 'orange'},
	{'value': 'medicalHelp', 'name': 'Medical Help', 'selected': false, 'class': 'fa-plus-square', 'color': '#F47A7A'},
	{'value': 'shelter', 'name': 'Shelter', 'selected': false, 'class': 'fa-bed', 'color': '#A5B6FA'},
	{'value': 'transportToHome', 'name': 'Transport to Home', 'selected': false, 'class': 'fa-bus', 'color': 'purple'},
	{'value': 'other', 'name': 'Other', 'selected': false, 'class': 'fa-adjust', 'color': '#8A8A8A'},
    ];
    tab;
    tabIndex;
    tabList = [
	{'key': 'all', 'name': 'All', 'selected': false, 'class': 'fa-arrows-alt', 'color': 'green'},
	{'key': 'team', 'name': 'My Team', 'selected': false, 'class': 'fa-group', 'color': 'brown'},
	{'key': 'mine', 'name': 'Assigned To Me', 'selected': false, 'class': 'fa-user', 'color': 'purple'},
//	{'key': 'region', 'name': 'My Region', 'selected': false, 'class': 'fa-map-marker', 'color': 'red'},
    ];

    constructor(
        public authService: AuthService,
        private entityService: EntityService,
        private userService: UserService,
        private downloadService: DownloadService,
        private router:Router,
	private location: Location,
	private snackBar: MatSnackBar,
	@Inject(DOCUMENT) private document: Document,
        private dialog: MatDialog
    ) {
        this.usergroup=localStorage.getItem('usergroup')
        this.user_role = localStorage.getItem('ur');
        this.groupID = localStorage.getItem('groupid');
        this.userID = localStorage.getItem('userid');
	if (localStorage.getItem('usergroup') === 'wassan') {
	    this.statusOptions = [
		{'value': 'not-started', 'name': 'Not started'},
		{'value': 'contacted-follow-up-person', 'name': 'Contacted the follow-up person'},
		{'value': 'in-process', 'name': 'In process'},
		{'value': 'visited-migrant', 'name': 'Visited the migrant'},
		{'value': 'closed', 'name': 'Closed'},
		{'value': 'none', 'name': 'None'}
	    ];
	}

        this.filterForm = new FormGroup({
            formio_usergroup : new FormControl(),
            assigned_to_group__id : new FormControl('undefined'),
            assigned_to_user__id : new FormControl(),
            limit : new FormControl(10),
            ordering : new FormControl('-created'),
            volunteer: new FormControl(),
            state: new FormControl(),
            district: new FormControl(),
            assigned_to_user__name__icontains: new FormControl(),
            assigned_to_user__isnull:  new FormControl(),
            assigned_to_group__name__icontains: new FormControl(),
            assigned_to_group__isnull:  new FormControl(),
	    what_help__contains: new FormControl(),
            search: new FormControl(),
            location: new FormControl(),
            status: new FormControl(),
            dummy: new FormControl(),
            urgency: new FormControl(),
            record_type: new FormControl('helpseekers')
        });
	this.helpOptions.forEach(option => {
	    this.filterForm.addControl(option.value, new FormControl(option.selected));
	});

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

        this.page = this.filterForm.valueChanges.pipe(
            debounceTime(200),
            startWith(this.filterForm.value),
            merge(this.pageUrl),
            switchMap(urlOrFilter => this.entityService.list(urlOrFilter)),
            share()
        );

        this.dataLoaded = Promise.resolve(true);

        this.entityService.getAllStates()
                .subscribe(
                    data => {
                        console.log(' success');
                        this.states = data.results.map(
                            option => {
                                return {'id': option.count, 'name': option.state};
                            });
                        // console.log(this.states);
                    },
                    err => {
                        console.log("Failed");
                    }
                );

        this.entityService.getAllDistricts()
                .subscribe(
                    data => {
                        console.log(' success');
                        this.districts = data.results.map(
                            option => {
                                return {'id': option.count, 'name': option.district};
                            });
                        // console.log(this.districts);
                    },
                    err => {
                        console.log("Failed");
                    }
                );
          this.userService.getAllGroupsPublic()
                .subscribe(
                    data => {
                        console.log(' success');
                        this.groups = data.results;
                    },
                    err => {
                        console.log("Failed");
                    }
                );
             this.userService.getAllUsersPublic(this.usergroup)
                   .subscribe(
                       data => {
                           console.log(' success');
                           this.users = data.results;
                       },
                       err => {
                           console.log("Failed");
                       }
                   );

        this.page.subscribe(page => {
            this.entities = page.results;
	    this.checkState = false;
            delete this.selectedEntities;
	    this.selectedEntities = {};
	    console.log('Page Subscription');
	    //console.log(this.entities);
            this.bulkActionList = {};
            this.entities.forEach(entity => {
                this.selectedEntities[entity.id] = this.checkState;
            });
        });
    }

    onPageChanged(url: string) {
        this.pageUrl.next(url);
    }

    loadpage() {
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

    deleteEntity(id) {
	this.entityService.deleteItem(id)
	    .subscribe(
		data => {
		    this.success=true;
		    this.loadpage();
		},
		error => console.log("could no delete" + error)
            )
    }

    deleteAllEntitys() {
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

    public isUserManager() {
        return ( moment().isBefore(this.getExpiration()) && ( (this.getUserName() === "usermanager") || (this.getUserName() === "admin" )));
    }

    getUserName() {
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
        });
        this.bulkActionIntersection();
    }

    isEmpty(obj) {
	return Object.entries(obj).length === 0;
    }

    bulkActionIntersection() {
        console.log('EntityListComponent.bulkActionIntersection()');

        delete this.bulkActionList;
        this.bulkActionList = {};

        this.entities.forEach(entity => {
            if (this.selectedEntities[entity.id]) {
                console.log('bulk_action_list');
                console.log(entity.bulk_action_list);
                if (!this.isEmpty(this.bulkActionList)) {
                    // the dictionary has at least one element
                    console.log(`Before ${JSON.stringify(this.bulkActionList)}`);
                    console.log(`Before ${JSON.stringify(entity.bulk_action_list)}`);

                    for (let key in this.bulkActionList) {
                        console.log(`bulkActionList[${key}] = ${this.bulkActionList[key]}`);
                        if (!(key in entity.bulk_action_list)) {
                            console.log(`Deleting item[${this.bulkActionList[key]}]`);
                            delete this.bulkActionList[key];
                            console.log(`DELETION => ${JSON.stringify(this.bulkActionList)}`);
                        }
                    }
                    console.log(`After ${JSON.stringify(this.bulkActionList)}`);
                }
                else
                    Object.assign(this.bulkActionList, entity.bulk_action_list);
            }
        });

        console.log(`Final ${JSON.stringify(this.bulkActionList)}`);
    }

    onCBChange(entity) {
        console.log('EntityListComponent.onCBChange()');
        this.bulkActionIntersection();
        console.log(`Final ${JSON.stringify(this.bulkActionList)}`);
    }

    onBulkAction(action) {
        console.log(`EntityListComponent.applyBulkAction(${JSON.stringify(action)})`, action);
        if (action.key == 'export1') {
            this.exportSelected();
            return;
        }

	/*
	if (action.key == 'duplicate') {
	    this.snackBar.open('Submitted to the Approval Team', 'DUPLICATE', {
		duration: 5000,
	    });
	    return;
	}
	*/

        console.log(this.selectedEntities);
	let chosenEntites = [];

        this.entities.forEach(
	    entity => {
		if (this.selectedEntities[entity.id]) {
                    // this.bulkAction.Key(entity);
		    chosenEntites.push(entity);
		}
            });
	
	if (this.authService.isLoggedIn()){ 
            const dialogConfig = new MatDialogConfig();

            dialogConfig.disableClose = true;
            dialogConfig.autoFocus = true;

            dialogConfig.data = {
		'entities': chosenEntites,
		'action': action,
		'json': '',
	    };

            const dialogRef = this.dialog.open(BulkDialogComponent, dialogConfig);

            dialogRef.afterClosed().subscribe(
                data => {
		    let entity_ids = new  Array();
		    var length;
		    let ids_json : any;
                    
                    if (!data)   // Close pressed without any action.key
                        return;

		    console.log(`EntityListComponent.onBulkAction().dialogRef.afterClosed()`, data);
                    // FIXME - This is alredy there - this.selectedEntities[]
		    for (let entity of data.entities) {
			console.log("Printing entity id " + entity.id); // 1, "string", false
			entity_ids.push(entity.id)
		    }
		    console.log("Entity Ids is " + entity_ids);
		    ids_json = { "ids" : entity_ids}
                    this.entityService.createBulkOperation({
			'ids_json': ids_json,
			'bulk_action': data.action.key,
			'data_json': data.json
		    }).subscribe(
                        data => {
                            console.log('Bulk Operation Creattion Successful', data);
                            this.rand_number = Math.floor(Math.random()*(100)+0);
                            this.filterForm.controls['dummy'].setValue(this.rand_number);
			    if (data["bulk_action"]== "export"){
			    this.snackBar.open('Your file will be downloaded shortly', action.value, {
				duration: 3000,
			    });
                              this.document.location.href = 'https://coast-india.s3.ap-south-1.amazonaws.com/export/selected/'+data["data_json"]["filename"];
			    }else{
			    this.snackBar.open('Submitted Successfuly', action.value, {
				duration: 3000,
			    });
			    }
                        },
                        err => {
                            console.log("Bulk Operation  Creation Failed");
                        }
                    );
            	    //const replacer = (key, value) =>  String(value) === "null" || String(value) === "undefined" ? 0 : value; 
                    // data = JSON.parse( JSON.stringify(data, replacer));
                    console.log("Dialog output:", data);
                    /*
                    //this.entityService.createItem({'name':'default','latitude': this.latitude, 'longitude': this.longitude, 'record_type':type})
                    this.entityService.createItem({'name':'default','latitude': this.latitude, 'longitude': this.longitude, 'record_type':type, 'data_json':data,'address':this.address,'google_location_json':this.gmap_details})
                    */
                }
            );
	}else{
            this.router.navigate(['/login']);
	}
    }

    exportAll() {
        console.log(`EntityListComponent.exportAll()`);
    }

    exportSelected() {
        console.log(`EntityListComponent.exportSelected()`);
        console.log(this.selectedEntities);
	let chosenEntites: [];
        let columns = [
            {'key': 'title', 'value': 'Name'},
            {'key': 'contact_numbers', 'value': 'Contact Nos'},
            {'key': 'assigned_to_group', 'value': 'Group'},
            {'key': 'assigned_to_user', 'value': 'Volunteer'},
            {'key': 'status', 'value': 'Status'},
            {'key': 'urgency', 'value': 'Urgency'},
        ];

        chosenEntites = this.entities
            .filter(entity => this.selectedEntities[entity.id])
            .map(entity => {
                let trimmedEntity = [];
                columns.forEach(
                    col => {
                        if (col.key == 'title') 
                            trimmedEntity.push(`'${entity[col.key]}'`);
                        else if (col.key == 'assigned_to_user' ||
                            col.key == 'assigned_to_group') {
                            if (entity[col.key])
                                trimmedEntity.push(entity[col.key]['name']);
                            else
                                trimmedEntity.push('');
                        }
                        else
                            trimmedEntity.push(entity[col.key]);
                    });
                return trimmedEntity;
            });

        console.log('The Chosen Entities are:')
        console.log(chosenEntites);
        this.downloadService.exportAsCSV(columns, chosenEntites, 'export.csv');
    }

    onExport(){
	    console.log("User has clicked export button");
	    this.document.location.href = 'https://coast-india.s3.ap-south-1.amazonaws.com/export/data.csv';
    }

    needsFilter(needs) {
	if (!needs)
	    return [];

	let filteredNeeds =
	    needs.filter(
		need => (!need.key.includes('describe')  && (need.value != false) && (need.value != "None") && (need.value != "No issues"))
	    ).map(need => this.helpOptions.find(option => option.value === need.key));

	return filteredNeeds;
    }

    resetTabFilters() {
        console.log(`EntityListComponent.resetTabFilters()`);
        this.filterForm.controls['assigned_to_group__id'].setValue('undefined');
        this.filterForm.controls['assigned_to_user__id'].setValue('');
        // this.filterForm.controls['state & district'].setValue('');
    }

    onTabSelect($event=null) {
        if($event) {
            console.log('EntityListComponent.onTabSelect()', $event);
            this.tab = this.tabList[$event.index].key
        }
        console.log('EntityListComponent.onTabSelect()', this.tab);

        if(this.tab == 'mine') {
            console.log(`EntityListComponent.onTabSelect(): Filtering by User[${this.userID}]`);
            this.resetTabFilters();
            this.filterForm.controls['assigned_to_user__id'].setValue(this.userID);
        }
        else if (this.tab == 'team') {
            console.log(`EntityListComponent.onTabSelect(): Filtering by Team[${this.groupID}]`);
            this.resetTabFilters();
            this.filterForm.controls['assigned_to_group__id'].setValue(this.groupID);
        }
        else if (this.tab == 'region') {
            console.log(`EntityListComponent.onTabSelect(): Not Filtering`);
            this.resetTabFilters();
            // this.filterForm.controls['state & district'].setValue('');
            // #TBD preferrably by State & District ID
        }
        else {
            console.log(`EntityListComponent.onTabSelect(): Not Filtering`);
            this.filterForm.controls['assigned_to_group__id'].setValue('undefined');
            this.filterForm.controls['assigned_to_user__id'].setValue('');
        }
    }
}
