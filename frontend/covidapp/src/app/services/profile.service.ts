import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { Profile } from "../models/profile";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private endpoint = environment.apiURL+"/api/profile/";
  constructor( private http :  HttpClient ) { }
  getProfile():Observable<any>{
    return this.http.get(this.endpoint,this.getHttpOptions());
  }
  profileUpdate(payload:any):Observable<object>{
    return this.http.put(this.endpoint,payload,this.getHttpOptions())
  }
 
  getHttpOptions() {
   const token = localStorage.getItem("id_token");
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'JWT ' + token
      })
    };
  }

}
