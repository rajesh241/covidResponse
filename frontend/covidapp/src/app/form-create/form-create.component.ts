import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
//import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";

@Component({
    selector: 'app-form-create',
    templateUrl: './form-create.component.html',
    styleUrls: ['./form-create.component.css']
})
export class FormCreateComponent implements OnInit {
    title: 'Create a form that you can supply for the NGO/Support org';
    form; // : FormGroup;
    data;

    constructor() {}

    ngOnInit() {}

    onChange(event) {
        console.log(event);
        //this.data = (event.form)
    }
    /*
    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<FormCreateComponent>,
        @Inject(MAT_DIALOG_DATA) data) {
        this.data = data;
        this.title = data.title; // Needs to come from the user of the form
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
    */
}
