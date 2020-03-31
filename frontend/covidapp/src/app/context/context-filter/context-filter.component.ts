import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Observable, Subject } from 'rxjs';
import { map, debounceTime, merge, share, startWith, switchMap } from 'rxjs/operators';
import * as moment from "moment";

import { Page } from '../../pagination';
import { Context } from "../../models/context";
import { ContextService } from "../../services/context.service";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-context-filter',
  templateUrl: './context-filter.component.html',
  styleUrls: ['./context-filter.component.css']
})
export class ContextFilterComponent  {
  filterForm: FormGroup;
  page: Observable<Page<Context>>;
  pageUrl = new Subject<string>();
  success: boolean = false;
  dataLoaded: Promise<boolean>;
  constructor(
    public authService: AuthService, private contextService: ContextService
  ) {
    this.filterForm = new FormGroup({
      limit : new FormControl(10),
      ordering : new FormControl('-updated'),
      search: new FormControl()
    });
    this.page = this.filterForm.valueChanges.pipe(
      debounceTime(200),
      startWith(this.filterForm.value),
      merge(this.pageUrl),
      switchMap(urlOrFilter => this.contextService.list(urlOrFilter)),
      share()
    );
    this.dataLoaded = Promise.resolve(true);
  }

  onPageChanged(url: string) {
    this.pageUrl.next(url);
  }
  loadpage(){
    console.log("Load page is getting executed")
    this.page = this.filterForm.valueChanges.pipe(
      debounceTime(200),
      startWith(this.filterForm.value),
      merge(this.pageUrl),
      switchMap(urlOrFilter => this.contextService.list(urlOrFilter)),
      share()
    );
    this.dataLoaded = Promise.resolve(true);
  }

  deleteContext(id){
	this.contextService.deleteItem(id)
	    .subscribe(
		data => {
		    this.success=true;
		    this.loadpage();
		},
		error => console.log("could no delete" + error)
            )
    }

    deleteAllContexts(){
            console.log("this will delete all contexts");
            this.contextService.bulkDeleteItems({'user_ids': ['all'] })
	    .subscribe(
		data => {
		    this.success=true;
		    this.loadpage();
		},
		error => console.log("could not delete" + error)
            )

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
