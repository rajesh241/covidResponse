import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router"

import { Observable, Subject } from 'rxjs';
import { map, debounceTime, merge, share, startWith, switchMap } from 'rxjs/operators';
import * as moment from 'moment';

import { Page } from '../../pagination';
import { Entity } from '../../models/entity';
import { EntityService } from '../../services/entity.service';
import { AuthService } from '../../services/auth.service';

import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { BulkDialogComponent } from '../bulk-dialog/bulk-dialog.component';


@Component({
  selector: 'app-my-entity-list',
  templateUrl: './my-entity-list.component.html',
  styleUrls: ['./my-entity-list.component.css']
})
export class MyEntityListComponent implements OnInit {

    showAddressBar: boolean = false;
    filterForm: FormGroup;
    page: Observable<Page<Entity>>;
    pageUrl = new Subject<string>();
    success: boolean = false;
    dataLoaded: Promise<boolean>;
    selectedEntities: any;
    checkState: boolean = false;
    entities: any;
    bulkAction: string = 'none';
    bulkActionList = {};
    panelOpen = true;
    userid:string;
    statusOptions = [
        {'value': 'to_call', 'name': 'To Call'},
        {'value': 'assign_to_volunteer', 'name': 'Assign To Volunteer'},
        {'value': 'assign_to_org', 'name': 'Assign to Org'},
        {'value': 'followup', 'name': 'Follow Up'},
        {'value': 'closed', 'name': 'Closed'}
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

    constructor(
        public authService: AuthService,
        private entityService: EntityService,
        private dialog: MatDialog,
        private router:Router
  ) { 
        this.userid = localStorage.getItem("userid");  
	if (localStorage.getItem('usergroup') === 'wassan') {
	    this.statusOptions = [
		{'value': 'not_started', 'name': 'Not started'},
		{'value': 'contacted_the_followup', 'name': 'Contacted the follow-up person'},
		{'value': 'in_process', 'name': 'In process'},
		{'value': 'visited_the_migrant', 'name': 'Visited the migrant'},
		{'value': 'closed', 'name': 'Closed'}
	    ];
	}
  
        this.filterForm = new FormGroup({
            limit : new FormControl(10),
            ordering : new FormControl('-created'),
            assigned_to_user__id: new FormControl(this.userid),
            search: new FormControl(),
            status: new FormControl(),
            urgency: new FormControl()
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
            });
  }

  ngOnInit() {
  }

    onPageChanged(url: string) {
        this.pageUrl.next(url);
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

    needsFilter(needs) {
	if (!needs)
	    return [];

	let filteredNeeds =
	    needs.filter(
		need => (!need.key.includes('describe')  && (need.value != false) && (need.value != "None") && (need.value != "No issues"))
	    ).map(need => this.helpOptions.find(option => option.value === need.key));

	return filteredNeeds;
    }
}
