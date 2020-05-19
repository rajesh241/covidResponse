import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, Validators, FormGroup, FormControl } from "@angular/forms";
import { Observable, Subject } from 'rxjs';
import { debounceTime, merge, share, startWith, switchMap } from 'rxjs/operators';

import { formioConfig } from '../../formio/config';
import { UserService } from "../../services/user.service";
import { PublicUser } from "../../models/publicuser";
import { PublicGroup } from "../../models/publicgroup";
import { Page } from '../../pagination';

@Component({
  selector: 'app-bulk-dialog',
  templateUrl: './bulk-dialog.component.html',
  styleUrls: ['./bulk-dialog.component.css']
})
export class BulkDialogComponent implements OnInit {
    title: string;
    form: FormGroup;
    users : any;//Observable<PublicUser[]>;
    groups : any;//Observable<PublicGroup[]>;
    dataLoaded: Promise<boolean>;
    action;
    entities;
    data;
    json_data;
    usergroup;
    form_url:string;
    formioBased:boolean= false;
    assignForm: FormGroup;
    loadVolunteerForm:boolean=false;
    loadGroupForm:boolean=false;
    loadDuplicateDialog:boolean=false;
    loadPledgeDialog: boolean = false;
    loadExportDialog:boolean=false;
    loadEndorseDialog:boolean=false;
    page: Observable<Page<PublicUser>>;
    pageUrl = new Subject<string>();
    user_role:any;
    groupID:any;
    filterForm: FormGroup;
    userid: any;
    exportFilename: any;
    statusOptions = [
        {'value': 'to_call', 'name': 'To Call'},
        {'value': 'assign_to_volunteer', 'name': 'Assign To Volunteer'},
        {'value': 'assign_to_org', 'name': 'Assign to Org'},
        {'value': 'followup', 'name': 'Follow Up'},
        {'value': 'closed', 'name': 'Closed'}
    ];
    public unassignable: boolean = false;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<BulkDialogComponent>,
        private userService: UserService,
        @Inject(MAT_DIALOG_DATA) data
    ) {
        //console.log(`Inside BulkDialogComponent.constructor(${JSON.stringify(data)})`);
        console.log(`Inside BulkDialogComponent.constructor()`);
        console.log(data);
	this.usergroup = localStorage.getItem('usergroup');
	this.userid = localStorage.getItem('userid');
        this.user_role = localStorage.getItem('ur');
        this.usergroup=localStorage.getItem('usergroup')
        if (this.user_role =="usergroupadmin"){
            this.groupID = "undefined"
        }else{
            this.groupID = localStorage.getItem('groupid');
        }
	this.exportFilename = this.userid + "_" +  Math.floor(Math.random()*(100)+0) + ".csv"
	this.data = data;
        this.action = data.action;
	this.title = data.action.value;
	console.log(this.action.key);
	if (this.action.key == 'assigntovolunteer') {
	    this.formioBased = false;
	    this.loadVolunteerForm = true;
	}
	else if (this.action.key == 'assigntogroup') {
	    this.formioBased = false;
	    this.loadGroupForm = true;
	}
	else if (this.action.key == 'duplicate') {
	    this.formioBased = false;
	    this.loadDuplicateDialog = true;
	}
	else if (this.action.key == 'pledge') {
	    this.formioBased = false;
	    this.loadPledgeDialog = true;
	}
	else if (this.action.key == 'export') {
	    this.formioBased = false;
	    this.loadExportDialog = true;
            this.data.json = {'filename' : this.exportFilename}
            this.dialogRef.close(this.data);
	}
	else if (this.action.key == 'endorse') {
	    this.formioBased = false;
	    this.loadEndorseDialog = true;
            this.data.json = {'user' : this.userid}
            this.dialogRef.close(this.data);
	}
	else{
	    this.formioBased = true;
	}

        // Visibity of unassign button
        if (this.user_role === 'usergroupadmin')
            this.unassignable = true;
        else if (this.user_role === 'groupAdmin' && this.loadVolunteerForm)
            this.unassignable = true;
        else
            this.unassignable = false;

	this.entities = data.entities;
	console.log(this.entities);
	this.form_url = formioConfig.appUrl + `/forms/v1/${this.action.key}`;
	console.log(`Action From URL[${this.form_url}]`);

        this.filterForm = new FormGroup({
          limit : new FormControl(10000),
          formio_usergroup : new FormControl(),
          group__id : new FormControl(),
          ordering : new FormControl('name')
        });
        this.page = this.filterForm.valueChanges.pipe(
          debounceTime(200),
          startWith(this.filterForm.value),
          merge(this.pageUrl),
          switchMap(urlOrFilter => this.userService.publicList(urlOrFilter)),
          share()
        );

    }

    ngOnInit() {
	if (this.action.key == "assigntovolunteer"){
            this.userService.getAllUsersPublic(this.usergroup)
                .subscribe(
                    data => {
                        console.log(' success', data);
                        this.users = data;
                        this.dataLoaded = Promise.resolve(true);
                    },
                    err => {
                        console.log("Failed");
                        this.dataLoaded = Promise.resolve(false);
                    }
                );
        }else{
            this.userService.getAllGroupsPublic()
                .subscribe(
                    data => {
                        console.log(' success', data);
                        this.groups = data;
                        this.dataLoaded = Promise.resolve(true);
                    },
                    err => {
                        console.log("Failed");
                        this.dataLoaded = Promise.resolve(false);
                    }
                );
	}

        this.assignForm = new FormGroup({
            assigntovolunteer: new FormControl(),
            assigntogroup: new FormControl(),
        });
        this.form = this.fb.group({
            //description: [this.description, []],
        });
    }

    onSubmit(commit) {
        console.log(`BulkDialogComponent.onSubmit(${commit})`);
	if (commit) {
            this.data.json = '';
            this.dialogRef.close(this.data);
	}
	else // could directly call this from HTML
	    this.cancel();
    }

    onUnassign() {
        console.log(`BulkDialogComponent.submitAssign()`, this.assignForm);
        if (this.loadVolunteerForm)
            this.assignForm.controls['assigntovolunteer'].setValue('');
        else
            this.assignForm.controls['assigntogroup'].setValue('');

        /* FIXME Why is this not required? Submit happening automatically?
        if (this.assignForm.valid) {
            console.log(this.assignForm.value);
            this.data.json = this.assignForm.value;
            this.dialogRef.close(this.data);
	}
        */
    }

    submitAssign(){
        console.log(`BulkDialogComponent.submitAssign()`);
        if (this.assignForm.valid) {
             console.log(this.assignForm.value);
             this.data.json = this.assignForm.value;
             this.dialogRef.close(this.data);
	}
    }

    save() {
        this.dialogRef.close(this.form.value);
    }

    close() {
        this.dialogRef.close();
    }

    cancel() {
	console.log(`BulkDialogComponent.cance(): User Cancelled`);
        this.close();
    }
}
