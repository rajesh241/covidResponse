import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";

import { formioConfig } from '../../formio/config';

@Component({
  selector: 'app-bulk-dialog',
  templateUrl: './bulk-dialog.component.html',
  styleUrls: ['./bulk-dialog.component.css']
})
export class BulkDialogComponent implements OnInit {
    form: FormGroup;
    action;
    entities;
    data;
    json_data;
    form_url:string = 'https://covid.libtech.in/assets/form.json';

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<BulkDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data
    ) {
        //console.log(`Inside BulkDialogComponent.constructor(${JSON.stringify(data)})`);
        console.log(`Inside BulkDialogComponent.constructor()`);
        console.log(data);
	this.data = data;
        this.action = data.action;
	this.entities = data.entities;
	console.log(this.entities);
    }

    ngOnInit() {
        console.log('Inside add-dialog ngOnInit()');
	this.form_url = formioConfig.appUrl + '/forms/v1/assigntoorg';
	console.log("form url sis " + this.form_url);
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

    save() {
        this.dialogRef.close(this.form.value);
    }

    close() {
        this.dialogRef.close();
    }
}
