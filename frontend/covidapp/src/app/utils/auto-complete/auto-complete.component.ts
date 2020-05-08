import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";

import { Observable } from 'rxjs';
import { map, startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { UserService } from "../../services/user.service";

@Component({
  selector: 'app-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.css']
})
export class AutoCompleteComponent implements OnInit {
    public items: any[];
    public acControl = new FormControl();
    public filteredOptions: Observable<any[]>;
    public result;

    constructor(
        private userService: UserService
    ) {
        console.log(`AutoCompleteComponent.constructor()`);
    }

    private _filter(value) {
        console.log(`AutoCompleteComponent._filter(${JSON.stringify(value)})`);
        if (typeof(value) == 'object') {
            this.result = value;
            return [value];
        }
        
        const filterValue = value.toLowerCase();
        return this.items.filter(option =>
                                 option.name.toLowerCase().includes(filterValue) ||
                                 String(option.id) == filterValue
                                );
    }

    ngOnInit() {
        this.userService.getAllUsersPublic(localStorage.getItem('usergroup'))
            .subscribe(
                data => {
                    console.log(' success', data);
                    this.items = data.results;
                    console.log('AutoCompleteComponent.userSubscribe()');
                    console.log(this.items);
                    // this.dataLoaded = Promise.resolve(true);
                },
                err => {
                    console.log("Failed");
                    // this.dataLoaded = Promise.resolve(false);
                }
            );

        this.filteredOptions = this.acControl.valueChanges.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            startWith(''),
            map(value => this._filter(value))
        );
    }

    public acDisplay(option) {
        console.log(`AutoCompleteComponent.displayAutoComplete(${JSON.stringify(option)})`);
        return option? `${option.name} | ${option.id}`: undefined;
    }
}
