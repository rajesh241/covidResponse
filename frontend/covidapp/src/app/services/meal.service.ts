import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { Meal } from "../models/meal";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MealService {
  private endpoint = environment.apiURL+"/api/meal/";
  private listEndPoint = environment.apiURL+"/api/meal/?ordering=-mealDate&-mealTime";
  constructor( private http :  HttpClient ) { }
  getMeal(id:number):Observable<any>{
    return this.http.get(this.endpoint+"?id="+id,this.getHttpOptions());
  }
  getAllMeals(): Observable<any>{
    console.log("print http headers");
    console.log(this.getHttpOptions());
    return this.http.get(this.listEndPoint,this.getHttpOptions());
  }
  
  mealCreate(meal:Meal){
    return this.http.post(this.endpoint,meal,this.getHttpOptions());
  }
  mealUpdate(id:number,payload:any):Observable<object>{
    return this.http.put(this.endpoint+"?id="+id,payload,this.getHttpOptions())
  }
  mealDelete(id: number):Observable<any>{
    return this.http.delete(this.endpoint+"?id="+id,this.getHttpOptions())

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
