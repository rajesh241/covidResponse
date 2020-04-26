import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from "@angular/router"
import { User } from "../../models/user";
import { UserService } from "../../services/user.service";
import { AuthService } from "../../services/auth.service";
import { PublicGroup } from "../../models/publicgroup";

@Component({
  selector: 'app-user-addedit',
  templateUrl: './user-addedit.component.html',
  styleUrls: ['./user-addedit.component.css']
})
export class UserAddeditComponent implements OnInit {
    user_role:any;
    user_id: any;
    dataLoaded: Promise<boolean>;
    groups:any;
    user:any;
    is_social_user:boolean=true;
    avatar_url:string;
    operation:string="add"
    form: FormGroup;
    title: any;
    actionType : any;
    roleOptions:any;
    success:any;
    error:any;
    usergroup:any;
    isEdit:boolean=false;
    constructor(private userService:UserService,
                  public authService:AuthService,
                  private router:Router,
                  private activatedRoute:ActivatedRoute) { 
	this.user_role = localStorage.getItem('ur');
	this.usergroup = localStorage.getItem('usergroup');
	if (this.authService.isGroupAdmin()){
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
    }

    ngOnInit() {
          this.activatedRoute.paramMap.subscribe(
              params => {
                  this.user_id=Number(params.get("id"));
              }
          )
	  if (this.user_id == 0){
		  this.operation = "add"
	          this.title = "Add User"
	          this.actionType = "Submit"
	  }else{
		  this.operation = "edit"
	          this.title = "Edit User"
	          this.actionType = "Submit"
	          this.isEdit = true;
	  }
          console.log("User id is " + this.operation)
          this.userService.getAllGroupsPublic()
                .subscribe(
                    data => {
                        console.log(' success', data);
                        this.groups = data.results;
	                if (this.user_id == 0){
                                this.dataLoaded = Promise.resolve(true);
	                }else{
                                this.loadUserData();
	                }
                    },
                    err => {
                        console.log("Failed");
                        this.dataLoaded = Promise.resolve(false);
                    }
                );
	  if (this.user_id == 0){
              this.form  = new FormGroup({
                name: new FormControl(''),
                email: new FormControl(''),
                password: new FormControl(''),
                password2: new FormControl(''),
                user_role: new FormControl(''),
                group: new FormControl(''),
                formio_usergroup: new FormControl(this.usergroup),
              });
	  }else{
              this.form  = new FormGroup({
                name: new FormControl(),
                user_role: new FormControl(''),
                group: new FormControl(''),
              });
	  }
    }

    loadUserData(){
        this.userService.getUser(this.user_id)
            .subscribe(
                data => {
                    this.user = data;
		    console.log(this.user)
                    this.avatar_url = this.user["avatar_url"]
                    this.form  = new FormGroup({
                      name: new FormControl(this.user.name),
                      user_role: new FormControl(this.user.user_role),
                      group: new FormControl(this.user.group),
                    });
                    if (this.user["provider"] == "native"){
                        this.is_social_user = false;
                        this.avatar_url = this.user["avatar"];
                    }
                    this.dataLoaded = Promise.resolve(true);
                }
            );
    }

    submit() {
      if (this.form.valid) {
        console.log(this.form.value);

	if (this.user_id == 0){
            this.userService.userCreate(this.form.value)
              .subscribe(
                data => {
                        console.log('register success', data);
                        this.success=true;
                        setTimeout(() => {
                          this.router.navigate(['/users/']);
                        }, 1000);
                },
                 err => {
                        console.log(err.error);
                        this.success=false;
                        this.error=this.authService.getErrorMessage(err);
                     }
              );
	}else{
            this.userService.userUpdate(this.user.id, this.form.value)
              .subscribe(
                data => {
                        console.log('register success', data);
                        this.success=true;
                        setTimeout(() => {
                          this.router.navigate(['/users/']);
                        }, 1000);
                },
                 err => {
                        console.log(err.error);
                        this.success=false;
                        this.error="Unable to edit";
                     }
              );

	}

      }
    }
}
