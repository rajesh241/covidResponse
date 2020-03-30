import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { User } from "../models/user";
import { environment } from '../../environments/environment';
import { Page, queryPaginated, queryPaginatedLocations} from '../pagination';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private endpoint = environment.apiURL+"/api/user/";
  private listEndPoint = environment.apiURL+"/api/user/";
  private editEndPoint = environment.apiURL+"/api/user/modify/profile/";
  private bulkDeleteEndpoint = environment.apiURL+"/api/user/bulkdelete/";
  private profileEndPoint = environment.apiURL+"/api/user/me/";
  constructor( private http :  HttpClient ) { }

  userBulkDelete(data){
    return this.http.post(this.bulkDeleteEndpoint,data,this.getHttpOptions());
  }
  getUserProfile():Observable<any>{
    return this.http.get(this.profileEndPoint,this.getHttpOptions());
  }
  getUser(id:number):Observable<any>{
    return this.http.get(this.endpoint+"?id="+id,this.getHttpOptions());
  }
  getAllUsers(): Observable<any>{
    console.log("print http headers");
    console.log(this.getHttpOptions());
    return this.http.get(this.listEndPoint,this.getHttpOptions());
  }
  
  list(urlOrFilter?: string | object): Observable<Page<User>> {
    return queryPaginated<User>(this.http, this.listEndPoint, urlOrFilter);
  }
  userCreate(payload:any){
    return this.http.post(this.endpoint,payload,this.getEditHttpOptions());
  }
  userUpdate(id:number,payload:any):Observable<object>{
    return this.http.patch(this.endpoint+"?id="+id,payload,this.getEditHttpOptions())
  }
  profileUpdate(payload:any):Observable<object>{
    return this.http.patch(this.profileEndPoint,payload,this.getEditHttpOptions())
  }
  profileDelete():Observable<object>{
    return this.http.delete(this.profileEndPoint,this.getHttpOptions())
  }
  userDelete(id: number):Observable<any>{
    return this.http.delete(this.endpoint+"?id="+id,this.getHttpOptions())

  }
 
  getEditHttpOptions() {
   const token = localStorage.getItem("id_token");
    return {
      headers: new HttpHeaders({
      "Authorization" : "Bearer " + token
      })
    };
  }
  getHttpOptions() {
   const token = localStorage.getItem("id_token");
    return {
      headers: new HttpHeaders({
      'content-type':'application/json',
      "Authorization" : "Bearer " + token
      })
    };
  }

}
