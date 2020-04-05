import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router"
import { User } from "../../models/user";
import { UserService } from "../../services/user.service";
import { AuthService } from "../../services/auth.service";

@Component({
    selector: 'app-user-edit',
    templateUrl: './user-edit.component.html',
    styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

    user: any; // Observable<User>;
    user_id: number;
    success: boolean=false;
    avatar:File;
    errorMessage:string="";
    is_social_user:boolean=true;
    avatar_url:string;
    // name:string='yesman';
    constructor(private userService:UserService,
                public authService:AuthService,
                private router:Router,
                private activatedRoute:ActivatedRoute) { }

    ngOnInit() {
        this.activatedRoute.paramMap.subscribe(
            params => {
                this.user_id=Number(params.get("id"));
            }
        )
        console.log("User id is " + this.user_id)
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
