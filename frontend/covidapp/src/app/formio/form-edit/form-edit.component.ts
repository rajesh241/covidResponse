import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-form-edit',
    templateUrl: './form-edit.component.html',
    styleUrls: ['./form-edit.component.css']
})
export class FormEditComponent implements OnInit {
    title:string = 'Update the prefilled form';
    data = {'initial_data': 'This needs to update with latest data', 'title': 'Howdie Word!'};
    json_url = window.origin + '/assets/forms/form.json';
    json_input: any;

    constructor() {
        this.data.title = this.title;
        this.json_input = {
    "display": "form",
    "components": [
        {
            "label": "Full Name",
            "spellcheck": true,
            "tableView": true,
            "calculateServer": false,
            "key": "fullName",
            "type": "textfield",
            "input": true,
            "placeholder": "Jack D",
            "defaultValue": "Adam Smith"
        },
        {
            "label": "Email",
            "spellcheck": true,
            "tableView": true,
            "calculateServer": false,
            "key": "email",
            "type": "email",
            "input": true,
            "placeholder": "lmn@abc.com",
            "defaultValue": "adam@smith.com"
        },
        {
            "label": "Password",
            "spellcheck": true,
            "tableView": false,
            "calculateServer": false,
            "key": "password",
            "type": "password",
            "input": true,
            "protected": true,
            "placeholder": "*********",
            "defaultValue": "$$$$$$$$"
        },
        {
            "type": "button",
            "label": "Update",
            "key": "submit",
            "disableOnInvalid": true,
            "input": true,
            "tableView": false
        }
    ]
};
    }

    ngOnInit() {
    }

    onUpdate($event) {
        console.log(`Inside add-dialog onSubmit(${$event})`);
        console.log($event.data);
        this.data = $event.data;
    }

}
