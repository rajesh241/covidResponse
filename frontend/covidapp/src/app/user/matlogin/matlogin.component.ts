import { Input, Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { OnInit, NgZone } from '@angular/core';
import { GoogleLoginProvider } from 'angular4-social-login';
import { AuthService as GAuthService } from 'angular4-social-login'; 
import { Router } from "@angular/router"

import { coastConfig } from '../../../config';
import { AuthService } from "../../services/auth.service";
declare var FB: any;


@Component({
  selector: 'app-matlogin',
  templateUrl: './matlogin.component.html',
  styleUrls: ['./matlogin.component.css']
})
export class MatloginComponent implements OnInit {
     userGroupOptions = ["wassan", "swan"]
     success:boolean=false;
     displaySelection:boolean=false;
  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });
    constructor(private _socioAuthServ: GAuthService,
	        public authService:AuthService,
	        private router : Router,
                private ngZone: NgZone
	       ) {}
    ngOnInit() {

        (window as any).fbAsyncInit = function() {
            FB.init({
                appId      : coastConfig.FACEBOOKAPPID,
                cookie     : true,
                xfbml      : true,
                version    : 'v3.2'
            });
            FB.AppEvents.logPageView();
        };

        (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

    }
  
  onUserLogin(){
      if (this.authService.isStaff()){
              console.log("this user is staff");
              this.displaySelection = true;
      }else{
              console.log("this user is not staff");
              setTimeout(() => {
                this.router.navigate(['/list']);
              }, 500);
      }
  }

  submitUserGroup(userGroup){
      console.log("Clicked on " +userGroup);
      localStorage.setItem('usergroup', userGroup);
      setTimeout(() => {
        this.router.navigate(['/list']);
      }, 500);
  }
  submit() {
    if (this.form.valid) {
      console.log(this.form.value);
      this.authService.login(this.form.value)
            .subscribe(
                data => {
                    console.log('login success', data);
                    this.authService.setSession(data);
		    this.onUserLogin();
		    this.success=true;
                },
                err => {
                    console.log("Login Failed");
		    this.success=false;
		    this.error="Login Failed";
                }
            );


      this.submitEM.emit(this.form.value);
    }
  }
  @Input() error: string | null;

  @Output() submitEM = new EventEmitter();
}

