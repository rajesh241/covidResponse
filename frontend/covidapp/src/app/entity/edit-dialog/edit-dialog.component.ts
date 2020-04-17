import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";

import { formioConfig } from '../../formio/config';
import { CovidLocateComponent } from '../../covid/covid-locate/covid-locate.component';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.css']
})
export class EditDialogComponent implements OnInit {
    form: FormGroup;
    title:string = 'Update the details of the NGO/Support Org'
    entity;
    data;
    form_url:string = 'https://covid.libtech.in/assets/form.json';

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<EditDialogComponent>,
        @Inject(MAT_DIALOG_DATA) entity
    ) {    
        console.log(`Inside EditDialogComponent.constructor(${JSON.stringify(entity)})`);
        console.log(entity);
        this.entity = entity;
	console.log("printing entity");
	console.log(this.entity.feedback_form_json);
	console.log(this.entity);
    }

    ngOnInit() {
        console.log('Inside add-dialog ngOnInit()');
	console.log("pritning the entity");
	console.log(this.entity);
	if (this.entity.record_type == "volunteer"){
	    //this.form_url = 'https://formio.libtech.in/forms/supportnetwork';
	    this.form_url = formioConfig.appUrl + '/forms/v1/supportnetwork';
	}else{
	    //this.form_url = 'https://formio.libtech.in/data/helpseeker';
	    this.form_url = formioConfig.appUrl + '/forms/v1/helpseekers';
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
