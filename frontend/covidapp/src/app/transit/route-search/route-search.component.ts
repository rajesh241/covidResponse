import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { AuthService } from "../../services/auth.service";
import { EntityService } from "../../services/entity.service";
// import { UserService } from "../../services/user.service";

import { MatSnackBar } from "@angular/material/snack-bar";


@Component({
    selector: 'app-route-search',
    template: '<b class="container">Work In Progress</b>',
    //templateUrl: './route-search.component.html',
    styleUrls: ['./route-search.component.css']
})
export class RouteSearchComponent implements OnInit {
    public panelOpen: boolean = true;
    public showFindButton: boolean = false;
    public filterForm: FormGroup;
    public orgs: any[];
    public teams: any[];
    public states: any[];
    private districts: any[];
    public filteredDistricts = {};
    public startDistricts;
    public endDistricts;
    // public routes: any;
    public routeChosen;
    public routes = [
        [{'district_code':708,'name':'Anantapur'},{'district_code':713,'name':'Kurnool'},{'district_code':714,'name':'Prakasam'},{'district_code':711,'name':'Guntur'},{'district_code':712,'name':'Krishna'},{'district_code':1348,'name':'Khammam'},{'district_code':1053,'name':'Malkangiri'},{'district_code':786,'name':'Bastar'},{'district_code':790,'name':'Dhamtari'},{'district_code':800,'name':'Raipur'},{'district_code':799,'name':'Raigarh'},{'district_code':802,'name':'Surguja'},{'district_code':880,'name':'Gumla'},{'district_code':892,'name':'Ranchi'}],
        [{'district_code':708,'name':'Anantapur'},{'district_code':714,'name':'Prakasam'},{'district_code':711,'name':'Guntur'},{'district_code':712,'name':'Krishna'},{'district_code':1348,'name':'Khammam'},{'district_code':1053,'name':'Malkangiri'},{'district_code':786,'name':'Bastar'},{'district_code':790,'name':'Dhamtari'},{'district_code':800,'name':'Raipur'},{'district_code':799,'name':'Raigarh'},{'district_code':802,'name':'Surguja'},{'district_code':880,'name':'Gumla'},{'district_code':892,'name':'Ranchi'}],
        [{'district_code':708,'name':'Anantapur'},{'district_code':713,'name':'Kurnool'},{'district_code':711,'name':'Guntur'},{'district_code':712,'name':'Krishna'},{'district_code':1348,'name':'Khammam'},{'district_code':1053,'name':'Malkangiri'},{'district_code':786,'name':'Bastar'},{'district_code':790,'name':'Dhamtari'},{'district_code':800,'name':'Raipur'},{'district_code':799,'name':'Raigarh'},{'district_code':802,'name':'Surguja'},{'district_code':880,'name':'Gumla'},{'district_code':892,'name':'Ranchi'}],
        [{'district_code':708,'name':'Anantapur'},{'district_code':713,'name':'Kurnool'},{'district_code':714,'name':'Prakasam'},{'district_code':711,'name':'Guntur'},{'district_code':712,'name':'Krishna'},{'district_code':1348,'name':'Khammam'},{'district_code':1053,'name':'Malkangiri'},{'district_code':800,'name':'Raipur'},{'district_code':799,'name':'Raigarh'},{'district_code':802,'name':'Surguja'},{'district_code':880,'name':'Gumla'},{'district_code':892,'name':'Ranchi'}],
        [{'district_code':708,'name':'Anantapur'},{'district_code':711,'name':'Guntur'},{'district_code':712,'name':'Krishna'},{'district_code':1348,'name':'Khammam'},{'district_code':1053,'name':'Malkangiri'},{'district_code':786,'name':'Bastar'},{'district_code':790,'name':'Dhamtari'},{'district_code':800,'name':'Raipur'},{'district_code':799,'name':'Raigarh'},{'district_code':802,'name':'Surguja'},{'district_code':880,'name':'Gumla'},{'district_code':892,'name':'Ranchi'}],
    ];
        
    constructor(
        public authService: AuthService,
        private entityService: EntityService,
        //private userService: UserService,
	private snackBar: MatSnackBar
    ) {
        console.log('RouteSearchComponent.constructor()');
        this.filterForm = new FormGroup({
            assigned_to_group__id : new FormControl('undefined'),
            assigned_to_user__id : new FormControl(),
            assigned_to_group__organization__id: new FormControl(),
            
            startState: new FormControl(),
            endState: new FormControl(),
            startDistrict: new FormControl(),
            endDistrict: new FormControl(),
            location: new FormControl(),
            // routeChosen: new FormControl(),
        });

        this.showFindButton = true; // FIXME
        /*
        this.filterForm.valueChanges.subscribe(
            value =>
                {
                    console.log('RouteSearchComponent.filterForm.valueChanges', this.filterForm);
                    if (this.filterForm.get('startDistrict') && this.filterForm.get('endDistrict'))
                        this.showFindButton = true;
                    else
                        this.showFindButton = false;
                }
        );

        this.filterForm.controls['startState'].valueChanges.subscribe(
            value =>
                {
                    console.log('RouteSearchComponent| startState.valueChanges', value);
                    if(!value)
                        this.startDistricts = this.districts;
                    else
                        this.startDistricts = this.districts.filter(obj => obj.state === value);
                    console.log('RouteSearchComponent| startState.valueChanges', this.startDistricts);                    
                    this.filterForm.controls['startDistrict'].setValue('');
                }
        );
        this.filterForm.controls['endState'].valueChanges.subscribe(
            value =>
                {
                    console.log('RouteSearchComponent| endState.valueChanges', value);
                    if(!value)
                        this.endDistricts = this.districts;
                    else
                        this.endDistricts = this.districts.filter(obj => obj.state === value);
                    console.log('RouteSearchComponent| endState.valueChanges', this.endDistricts);                    
                    this.filterForm.controls['endDistrict'].setValue('');
                }
        );
        */

    }

    ngOnInit() {
        console.log('RouteSearchComponent.ngOnInit()');
        /*
        this.userService.getAllOrgsPublic()
            .subscribe(
                data => {
                    this.orgs = data.results;
                    console.log('RouteSearchComponent.ngOnInit().getAllOrgsPublic()', this.orgs);
                },
            );

        this.userService.getAllGroupsPublic()
            .subscribe(
                data => {
                    this.teams = data.results;
                    console.log('RouteSearchComponent.ngOnInit().getAllGroupsPublic()', this.teams);
                }
            );
            */
        this.entityService.getStates()
            .subscribe(
                data => {
                    this.states = data.results.map(
                        obj => {
                            return {'id': obj.code, 'name': obj.name};
                        });
                    // console.log('RouteSearchComponent.ngOnInit().getStates()', this.states);
                }
            );

        this.entityService.getDistricts()
            .subscribe(
                data => {
                    this.districts = data.results.map(
                        obj => {
                            return {'id': obj.code, 'name': obj.name, 'state': obj.state_code};
                        });
                    // console.log('RouteSearchComponent.ngOnInit().getDistricts()', this.districts);
                    this.startDistricts = this.districts;
                    this.endDistricts = this.districts;
                    /*
                    this.startDistricts = this.filterForm.controls['startState'].valueChanges.pipe(
                        value => this.districts.filter(obj => obj.state === value)
                    );
                    */
                }
            );
    }

    onStateChange(key, stateCode) {
        console.log(`RouteSearchComponent.onStateChange(${key}, ${stateCode})`);
        this.filteredDistricts[key] = this.districts.filter(obj => obj.state === stateCode);
    }

    onFind() {
        console.log(`RouteSearchComponent.onFind()`);
        this.entityService.findRoutes('Anantapur', 'Ranchi').subscribe(data =>
                                                                       {
                                                                           console.log(`RouteSearchComponent | findRoutes()`, data);
                                                                       });
    }
}
