import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";

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
	@Inject(DOCUMENT) private document: Document,
        private dialogRef: MatDialogRef<AddDialogComponent>,
        @Inject(MAT_DIALOG_DATA) marker) {
        this.marker = marker;
	console.log("printing marker");
	console.log(this.marker.feedback_form_json);
	console.log(this.marker);
	this.form_url = 'https://covid.libtech.in/assets/${marker.record_type}.json';
	this.form_url = 'http://covid.libtech.in:8012/assets/helpseeker';
    }

    ngOnInit() {
	console.log(this.document.location.href);
	console.log("pritning the marker");
	console.log(this.marker);
	if (this.marker.record_type == "volunteer"){
		this.form_url = this.document.location.href + "assets/forms/supportnetwork";
	}else{
		this.form_url = this.document.location.href + "assets/forms/helpseeker";
	}
	console.log("form url sis " + this.form_url);
        this.form = this.fb.group({
            //description: [this.description, []],
        });
    }

    onSubmit($event) {
        console.log($event);
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
