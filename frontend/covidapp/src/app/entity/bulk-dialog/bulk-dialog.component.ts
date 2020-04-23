import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, Validators, FormGroup, FormControl } from "@angular/forms";

import { formioConfig } from '../../formio/config';
import { UserService } from "../../services/user.service";
import { PublicUser } from "../../models/publicuser";

@Component({
  selector: 'app-bulk-dialog',
  templateUrl: './bulk-dialog.component.html',
  styleUrls: ['./bulk-dialog.component.css']
})
export class BulkDialogComponent implements OnInit {
    form: FormGroup;
    users : Observable<PublicUser[]>;
    dataLoaded: Promise<boolean>;
    action;
    entities;
    data;
    json_data;
    form_url:string;
    formioBased:boolean= false;
    assignForm: FormGroup;
    statusOptions = [
        {'value': 'to_call', 'name': 'To Call'},
        {'value': 'assign_to_volunteer', 'name': 'Assign To Volunteer'},
        {'value': 'assign_to_org', 'name': 'Assign to Org'},
        {'value': 'followup', 'name': 'Follow Up'},
        {'value': 'closed', 'name': 'Closed'}
    ];

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<BulkDialogComponent>,
        private userService: UserService,
        @Inject(MAT_DIALOG_DATA) data
    ) {
        //console.log(`Inside BulkDialogComponent.constructor(${JSON.stringify(data)})`);
        console.log(`Inside BulkDialogComponent.constructor()`);
        console.log(data);
	this.data = data;
        this.action = data.action;
	console.log(this.action);
	if (this.action == "assigntovolunteer"){
		this.formioBased = false;
	}else if(this.action == "assigntogroup"){
		this.formioBased = false;
	}else{
		this.formioBased = true;
	}
	this.entities = data.entities;
	console.log(this.entities);
	this.form_url = formioConfig.appUrl + `/forms/v1/${this.action}`;
	console.log(`Action From URL[${this.form_url}]`);
    }

    ngOnInit() {
      this.userService.getAllUsersPublic()
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


        this.assignForm = new FormGroup({
            assigntovolunteer: new FormControl(),
        });
        this.form = this.fb.group({
            //description: [this.description, []],
        });
    }

    onSubmit($event) {
        console.log(`Inside add-dialog onSubmit(${$event})`);
        console.log($event.data);
        this.data.json = $event.data;
        this.dialogRef.close(this.data);
    }
    submitAssign(){
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
}
