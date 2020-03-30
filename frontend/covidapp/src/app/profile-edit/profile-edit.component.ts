import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { User } from "../models/user";
import { UserService } from "../services/user.service";
import { ActivatedRoute } from "@angular/router";
import {Router} from "@angular/router"
import { AuthService } from "../services/auth.service";

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})


export class ProfileEditComponent implements OnInit {

  user : Observable<User>;
  dataLoaded: Promise<boolean>;
  user_id: number;
  success: boolean=false;
  deleted:boolean=false;
  confirm_delete: boolean=false;
  avatar:File;
  is_social_user:boolean=true;
  avatar_url:string;
  errorMessage:string;
 // name:string='yesman';
  constructor(private userService:UserService,
	      private authService:AuthService,
	      private router:Router,
              private activatedRoute:ActivatedRoute) { }

  ngOnInit() {
    this.loadUserData();

  }
 
  loadUserData(){
    this.userService.getUserProfile()
         .subscribe(
            data => {
              this.user = data;
	      this.success = false;
	      this.avatar_url = this.user["avatar_url"]
	      if (this.user["provider"] == "native"){
		      this.is_social_user = false;
		      this.avatar_url = this.user["avatar"];
	      }
              this.dataLoaded = Promise.resolve(true);
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
     this.userService.profileUpdate(uploadData)
         .subscribe(
             data => {
                this.user = data as Observable<User>;
                this.success = true;
		//this.loadUserData();
                setTimeout(() => {
		this.loadUserData();
                this.router.navigate(['/profile/']);
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
  onDelete(){
       this.confirm_delete = true;
  }
  yesDelete(){
     console.log("We will delete the account")
     this.userService.profileDelete()
         .subscribe(
             data => {
                this.deleted = true;
		this.authService.logout();
                this.router.navigate(['/login/']);
	     },
             error => console.log("User could not be deleted " + error)
            );
  }
  cancelDelete(){
	 this.confirm_delete=false;
  }
}
