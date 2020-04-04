import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";

@Component({
    selector: 'app-marker-dialog',
    templateUrl: './marker-dialog.component.html',
    styleUrls: ['./marker-dialog.component.css']
})
export class MarkerDialogComponent implements OnInit {
    form: FormGroup;
    title:string = 'Update the details of the NGO/Support Org'
    marker;
    data;
    //form_url:string = "https://libtech-india-data.s3.ap-south-1.amazonaws.com/covid/json/example.json";    
    form_url:string = "https://example.form.io/example";
    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<MarkerDialogComponent>,
        @Inject(MAT_DIALOG_DATA) marker) {
        this.marker = marker;
	console.log("printing marker");
	console.log(this.marker.feedback_form_json);
	console.log(this.marker);
    }

    ngOnInit() {
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
