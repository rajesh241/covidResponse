import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";

import { formioConfig } from '../../formio/config';

@Component({
    selector: 'app-add-dialog',
    templateUrl: './add-dialog.component.html',
    styleUrls: ['./add-dialog.component.css']
})
export class AddDialogComponent implements OnInit {
    form: FormGroup;
    title:string = 'Update the details of the NGO/Support Org'
    marker;
    data;
    form_url:string = 'https://covid.libtech.in/assets/form.json';

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<AddDialogComponent>,
        @Inject(MAT_DIALOG_DATA) marker
    ) {    
        console.log(`Inside add-dialog constructor(${JSON.stringify(marker)})`);
        console.log(marker);
        this.marker = marker;
	console.log("printing marker");
	console.log(this.marker.feedback_form_json);
	console.log(this.marker);
    }

    ngOnInit() {
        console.log('Inside add-dialog ngOnInit()');
	console.log("pritning the marker");
	console.log(this.marker);
	if (this.marker.record_type == "volunteer"){
	    //this.form_url = 'https://formio.libtech.in/forms/supportnetwork';
	    this.form_url = formioConfig.appUrl + '/forms/supportnetwork';
	}else{
	    //this.form_url = 'https://formio.libtech.in/data/helpseeker';
	    this.form_url = formioConfig.appUrl + '/data/helpseeker';
	}
	console.log("form url sis " + this.form_url);
        this.form = this.fb.group({
            //description: [this.description, []],
        });
    }

    onSubmit($event) {
        console.log(`Inside add-dialog onSubmit(${$event})`);
        console.log($event.data);
        this.data = $event.data;
        this.dialogRef.close(this.data);
    }

    save() {
        this.dialogRef.close(this.form.value);
    }

    close() {
        this.dialogRef.close();
    }
}
