import * as moment from "moment";
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import * as jwt_decode from 'jwt-decode';
import { Observable } from 'rxjs';
import {tap} from 'rxjs/internal/operators';
import { MealService } from "./meal.service";
import {Router} from "@angular/router"
import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {
  private httpOptions: any;
  public token: string;
  public is_after:boolean = false;
  private authendpoint = environment.apiURL+"/api/user/token/";
  private fbendpoint = environment.apiURL+"/api/user/social/facebook/";
  private googleendpoint = environment.apiURL+"/api/user/social/google-oauth2/";
  private registerendpoint = environment.apiURL+"/api/user/create/";
  private verifyregisterendpoint = environment.apiURL+"/api/user/activate/";
  private passwordresetendpoint = environment.apiURL+"/api/passwordreset/";
  private passwordresetconfirm = environment.apiURL+"/api/passwordreset/confirm/";
  private inviteendpoint = environment.apiURL+"/api/user/invite/";
  private endpoint = environment.apiURL+"/api/meal/";
    constructor(private http: HttpClient, private mealService : MealService,private router : Router) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
    }

    public getErrorMessage(err){
	    var value:string=""
            Object.keys(err.error).forEach(function(key){
             if (key == 'detail'){
		value = err.error[key]
	     }
	     else if (key == "non_field_errors"){
		value = err.error[key]
	     }
	     else{
                 console.log(err.error[key]);
                 value = value  +  "<p>" + key + " " + err.error[key]+"</p>" ;
	     }
             console.log(value);
	    });
	    return value
    }	    
    public pwdResetConfirm(user) {
     return(this.http.post(this.passwordresetconfirm, JSON.stringify(user), this.httpOptions));
    }
    public login(user) {
     return(this.http.post(this.authendpoint, JSON.stringify(user), this.httpOptions));
    }
    public fblogin(user){
     return(this.http.post(this.fbendpoint, JSON.stringify(user), this.httpOptions));
    }
    public glogin(user){
     return(this.http.post(this.googleendpoint, JSON.stringify(user), this.httpOptions));
    }


   public invite(user) {
     return(this.http.post(this.inviteendpoint, JSON.stringify(user), this.httpOptions));
  }
   public passwordreset(user) {
     return(this.http.post(this.passwordresetendpoint, JSON.stringify(user), this.httpOptions));
  }
   public register(user) {
     return(this.http.post(this.registerendpoint, JSON.stringify(user), this.httpOptions));
  }
   public verifyregistration(user) {
     console.log(user)
     return(this.http.post(this.verifyregisterendpoint, JSON.stringify(user), this.httpOptions));
  }

    
  public setSession(authResult) {
    const ts = moment(authResult.expires).valueOf();
    this.token = authResult.access;
    console.log("printing the curren token")
    console.log(this.token);
    var decoded = jwt_decode(this.token); 
    console.log(decoded);
    console.log("Received Expired" + decoded.exp);
    console.log("Expires at " + ts)
    localStorage.setItem('id_token', this.token);
    localStorage.setItem("expires_at", JSON.stringify(decoded.exp ));
    localStorage.setItem("username", decoded.name);
    localStorage.setItem("ur", decoded.ur);
    localStorage.setItem("group", decoded.group);
    setTimeout(() => {
        this.router.navigate(['/list']);
    }, 500);
  }          

  logout() {
      localStorage.removeItem("id_token");
      localStorage.removeItem("expires_at");
      localStorage.removeItem("username");
      localStorage.removeItem("ur");
  }
  public isLoggedIn(){
      const now = Date.now().valueOf() / 1000;
      const expiration = Number(localStorage.getItem("expires_at"));
      if (expiration > now){
         this.is_after = true
      }
      else{
        this.is_after = false
      }
     return this.is_after
}
  public isLoggedIn1() {
      console.log("lets see what is this saying");
      console.log(moment().isBefore(this.getExpiration()));
      return moment().isBefore(this.getExpiration());
  }

  public isUserManager(){
    return ( moment().isBefore(this.getExpiration()) && ( (this.getUserName() === "usermanager") || (this.getUserName() === "admin" )));
  }
  public isRealtor(){
      const ur = localStorage.getItem("ur")
      return ( (this.isLoggedIn()) && ( (ur === "admin") || (ur === "realtor") ))
  }
  public isAdmin(){
      const ur = localStorage.getItem("ur")
      return ( (this.isLoggedIn()) && (ur === "admin"))
  }
  isLoggedOut() {
      return !this.isLoggedIn();
  }
  getUserName(){
      const username = localStorage.getItem("username");
      return username
  } 
  getExpiration() {
      const expiration = localStorage.getItem("expires_at");
      const expiresAt = JSON.parse(expiration);
      return expiration
  //    return moment(expiresAt);
  } 
  assertAlive (decoded) {
  const now = Date.now().valueOf() / 1000
  if (typeof decoded.exp !== 'undefined' && decoded.exp < now) {
    throw new Error(`token expired: ${JSON.stringify(decoded)}`)
  }
  if (typeof decoded.nbf !== 'undefined' && decoded.nbf > now) {
    throw new Error(`token not yet valid: ${JSON.stringify(decoded)}`)
  }
 }

}
