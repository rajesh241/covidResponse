import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router"
import { User } from "../../models/user";
import { UserService } from "../../services/user.service";
import { AuthService } from "../../services/auth.service";
import { PublicGroup } from "../../models/publicgroup";

@Component({
    selector: 'app-user-edit',
    templateUrl: './user-edit.component.html',
    styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

    user: any; // Observable<User>;
    user_id: number;
    groups : any;//Observable<PublicGroup[]>;
    dataLoaded: Promise<boolean>;
    success: boolean=false;
    avatar:File;
    errorMessage:string="";
    is_social_user:boolean=true;
    avatar_url:string;
    user_role:string;
    roleOptions:any;
    // name:string='yesman';
    constructor(private userService:UserService,
                public authService:AuthService,
                private router:Router,
                private activatedRoute:ActivatedRoute) { 
	this.user_role = localStorage.getItem('ur');
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
    }

    ngOnInit() {
        this.activatedRoute.paramMap.subscribe(
            params => {
                this.user_id=Number(params.get("id"));
            }
        )
        console.log("User id is " + this.user_id)
        this.userService.getAllGroupsPublic()
              .subscribe(
                  data => {
                      console.log(' success', data);
                      this.groups = data;
                      this.dataLoaded = Promise.resolve(true);
                  },
                  err => {
                      console.log("Failed");
                      this.dataLoaded = Promise.resolve(false);
                  }
              );
        this.loadUserData();

    }

    loadUserData(){
        this.userService.getUser(this.user_id)
            .subscribe(
                data => {
                    this.user = data;
                    this.avatar_url = this.user["avatar_url"]
                    if (this.user["provider"] == "native"){
                        this.is_social_user = false;
                        this.avatar_url = this.user["avatar"];
                    }
                    console.log(this.user);
                    console.log(this.is_social_user);
                    console.log(this.avatar_url);
                }
            );
    }

    onImageChanged(event: any) {
        this.avatar = event.target.files[0];
    }

    updateUser() {
	console.log(this.user);
        const uploadData = new FormData();
        if(this.avatar){
            uploadData.append('avatar', this.avatar, this.avatar["name"]);
        }
        uploadData.append('name', this.user["name"]);
        if(this.user["password"]){
            uploadData.append('password', this.user["password"]);
            uploadData.append('password2', this.user["password2"]);
        }
        uploadData.append('is_active', this.user["is_active"]);
        uploadData.append('is_staff', this.user["is_staff"]);
        uploadData.append('is_locked', this.user["is_locked"]);
        uploadData.append('is_superuser', this.user["is_superuser"]);
        uploadData.append('user_role', this.user["user_role"]);
        this.userService.userUpdate(this.user_id,uploadData)
            .subscribe(
                data => {
                    this.user = data as Observable<User>;
                    this.success = true;
                    setTimeout(() => {
                        this.router.navigate(['/users/']);
                    }, 1000);
                },
                err => {
                    console.log(err.error);
                    this.success=false;
                    this.errorMessage=this.authService.getErrorMessage(err);
                }
            );
    }
    onSubmit(){
        this.updateUser();
    }

}
