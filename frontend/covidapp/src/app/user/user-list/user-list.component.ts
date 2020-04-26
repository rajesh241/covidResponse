import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Observable, Subject } from 'rxjs';
import { debounceTime, merge, share, startWith, switchMap } from 'rxjs/operators';
import * as moment from "moment";
import {Router} from "@angular/router"

import { Page } from '../../pagination';
import { User } from "../../models/user";
import { UserService } from "../../services/user.service";
import { AuthService } from "../../services/auth.service";
import { PublicGroup } from "../../models/publicgroup";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})

export class UserListComponent  implements OnInit{
  groups:any;
  filterForm: FormGroup;
  page: Observable<Page<User>>;
  pageUrl = new Subject<string>();
  success: boolean = false;
  dataLoaded: Promise<boolean>;
  usergroup:string;
  roleOptions:any;
  user_role:any;
  panelOpen = true;
  groupID:any;

  constructor(
    public authService: AuthService, private userService: UserService, private router : Router
  ) {
    this.user_role = localStorage.getItem('ur');
    this.groupID = localStorage.getItem('groupid');
    this.usergroup=localStorage.getItem('usergroup')
	if (this.user_role =="usergroupadmin"){
            this.roleOptions = [
                {'value': 'usergroupadmin', 'name': 'Super User'},
                {'value': 'groupadmin', 'name': 'Group Admin'},
                {'value': 'volunteer', 'name': 'volunteer'}
            ];
	}else{
            this.roleOptions = [
                {'value': 'groupadmin', 'name': 'Group Admin'},
                {'value': 'volunteer', 'name': 'volunteer'}
            ];
	}
    this.filterForm = new FormGroup({
      is_staff: new FormControl(),
      limit : new FormControl(10),
      user_role : new FormControl(),
      formio_usergroup : new FormControl(this.usergroup),
      group__id : new FormControl(this.groupID),
      ordering : new FormControl('-id'),
      search: new FormControl()
    });
    this.page = this.filterForm.valueChanges.pipe(
      debounceTime(200),
      startWith(this.filterForm.value),
      merge(this.pageUrl),
      switchMap(urlOrFilter => this.userService.list(urlOrFilter)),
      share()
    );
    this.dataLoaded = Promise.resolve(true);
  }


    ngOnInit() {

          this.userService.getAllGroupsPublic()
                .subscribe(
                    data => {
                        console.log(' success', data);
                        this.groups = data.results;
                        this.dataLoaded = Promise.resolve(true);
                    },
                    err => {
                        console.log("Failed");
                    }
                );
    }


  onPageChanged(url: string) {
    this.pageUrl.next(url);
  }
  loadpage(){
    this.page = this.filterForm.valueChanges.pipe(
      debounceTime(200),
      startWith(this.filterForm.value),
      merge(this.pageUrl),
      switchMap(urlOrFilter => this.userService.list(urlOrFilter)),
      share()
    );
    this.dataLoaded = Promise.resolve(true);
  }

  deleteUser(id){
	this.userService.userDelete(id)
	    .subscribe(
		data => {
		    this.success=true;
		    this.loadpage();
		},
		error => console.log("could no delete" + error)
            )
    }

    deleteAllUsers(){
            console.log("this will delete all users");
            this.userService.userBulkDelete({'user_ids': ['all'] })
	    .subscribe(
		data => {
		    this.success=true;
		    this.loadpage();
		},
		error => console.log("could not delete" + error)
            )

    }
  addUser(){
	  console.log("adding user")
        this.router.navigate(['/useradd']);
  }
  invite(){
        this.router.navigate(['/invite']);
  }
  public isUserManager(){
    return ( moment().isBefore(this.getExpiration()) && ( (this.getUserName() === "usermanager") || (this.getUserName() === "admin" )));
  } 
  getUserName(){
      const username = localStorage.getItem("username");
      return username
  } 
  getExpiration() {
      const expiration = localStorage.getItem("expires_at");
      const expiresAt = JSON.parse(expiration);
      return moment(expiresAt);
  }    


}
