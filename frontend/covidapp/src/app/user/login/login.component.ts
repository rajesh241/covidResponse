import { Component, OnInit, NgZone } from '@angular/core';
import { GoogleLoginProvider } from 'angularx-social-login';
import { AuthService as GAuthService } from 'angularx-social-login'; 
import { Router } from "@angular/router"

import { coastConfig } from '../../../config';
import { AuthService } from "../../services/auth.service";
declare var FB: any;

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    loginName:string = "user1";
    loginStatus=this.authService.isLoggedIn();
    allowLogin=false;
    username:string;
    email:string;
    password:string;
    success:boolean=false;
    errorMessage:string="";
    getLoginStatus(){
        return this.authService.isLoggedIn();
    }
    constructor(private _socioAuthServ: GAuthService,
	        public authService:AuthService,
	        private router : Router,
                private ngZone: NgZone
	       ) {
        setTimeout(
            () => { this.allowLogin =true;},2000
  	);
        
    }
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


    onLogin(){
        console.log(this.email);
        console.log(this.password);
        this.authService.login({'email': this.email, 'password': this.password})
            .subscribe(
                data => {
                    console.log('login success', data);
                    this.authService.setSession(data);
                    this.success=true;
                },
                err => {
                    console.log(err.error);
                    this.success=false;
	            this.errorMessage=this.authService.getErrorMessage(err);
                }
            );


    }

    fbLogin(){
        console.log("submit login to facebook");
        // FB.login();
        FB.login((response)=>
                 {
                     console.log('submitLogin',response);
                     if (response.authResponse)
                     {
                         //login success
		         this.ngZone.run(() => 
                                         this.authService.fblogin({'access_token': response.authResponse.accessToken})
                                         .subscribe(
                                             data => {
                                                 console.log('login success', data);
                                                 this.authService.setSession(data);
                                                 this.success=true;
                                             },
                                             err => {
                                                 this.errorMessage = "Unable to login with Facebook";
                                                 this.success=false;
                                             }

                                         )
		                        );
                     }
                     else
                     {
                         console.log('User login failed');
                     }
                 }, {scope: 'email'});

    }

    glogin(platform : string): void {
        platform = GoogleLoginProvider.PROVIDER_ID;
        this._socioAuthServ.signIn(platform).then(
            (response) => {
                console.log(platform + " logged in user data is= " , response);
                if (response.authToken)
                {
                    //login success
                    this.authService.glogin({'access_token': response.authToken})
                        .subscribe(
                            data => {
                                console.log('login success', data);
                                this.authService.setSession(data);
                                this.success=true;
                            },
                            err => {
                                this.errorMessage = "Unable to login wiht Google";
                                this.success=false;
                            }

                        );
                }
                else
                {
                    console.log('User login failed');
                }

            }
        );
    }
    
    // Method to log out.
    glogout(): void {
        this._socioAuthServ.signOut();
        console.log('User signed out.');
    }


}
