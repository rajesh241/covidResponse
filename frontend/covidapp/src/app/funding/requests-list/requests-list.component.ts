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
import { EntityService } from "../../services/entity.service";
import { PublicGroup } from "../../models/publicgroup";

@Component({
  selector: 'app-requests-list',
  templateUrl: './requests-list.component.html',
  styleUrls: ['./requests-list.component.css']
})
export class RequestsListComponent implements OnInit {
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
    public authService: AuthService, private userService: UserService, private entityService: EntityService, private router : Router
  ) {
    this.user_role = localStorage.getItem('ur');
    this.usergroup=localStorage.getItem('usergroup')
    this.filterForm = new FormGroup({
      limit : new FormControl(10),
      ordering : new FormControl('-id'),
      search: new FormControl()
    });
    this.page = this.filterForm.valueChanges.pipe(
      debounceTime(200),
      startWith(this.filterForm.value),
      merge(this.pageUrl),
      switchMap(urlOrFilter => this.entityService.listRequest(urlOrFilter)),
      share()
    );
    this.dataLoaded = Promise.resolve(true);
  }


    ngOnInit() {

    }


  onPageChanged(url: string) {
    this.pageUrl.next(url);
  }
  loadpage(){
    this.page = this.filterForm.valueChanges.pipe(
      debounceTime(200),
      startWith(this.filterForm.value),
      merge(this.pageUrl),
      switchMap(urlOrFilter => this.entityService.listRequest(urlOrFilter)),
      share()
    );
    this.dataLoaded = Promise.resolve(true);
  }

  addUser(){
	  console.log("adding user")
        this.router.navigate(['/useradd']);
  }


}
