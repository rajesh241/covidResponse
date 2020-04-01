
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { Context } from "../models/context";
import { environment } from '../../environments/environment';
import { Page, queryPaginated, queryPaginatedLocations} from '../pagination';

@Injectable({
  providedIn: 'root'
})
export class ContextService {
  private endpoint = environment.apiURL+"/api/public/context/";
  private listEndPoint = environment.apiURL+"/api/public/context/";
  private createEndPoint = environment.apiURL+"/api/public/create/";
  private bulkDeleteEndpoint = environment.apiURL+"/api/public/bulkdeleteapt/";
  constructor( private http :  HttpClient ) { }
  getItem(id:number):Observable<any>{
    return this.http.get(this.endpoint+"?id="+id,this.getHttpOptions());
  }
  getItemPublic(id:number):Observable<any>{
    return this.http.get(this.endpoint+"?id="+id,this.getPublicHttpOptions());
  }

  list(urlOrFilter?: string | object): Observable<Page<Context>> {
    return queryPaginated<Context>(this.http, this.listEndPoint, urlOrFilter);
  }
  geoList(geoBounds:object, urlOrFilter?: string | object): Observable<Page<Context>> {
    return queryPaginatedLocations<Context>(this.http, this.listEndPoint, geoBounds, urlOrFilter);
  }
  getAllItems(): Observable<any>{
    return this.http.get(this.listEndPoint,this.getHttpOptions());
  }
  
  bulkDeleteItems(data){
    return this.http.post(this.bulkDeleteEndpoint,data,this.getHttpOptions());
  }
  createItem(context:Context){
    return this.http.post(this.endpoint,context,this.getHttpOptions());
  }
  createItemPublic(context:Context){
    return this.http.post(this.createEndPoint,context,this.getPublicHttpOptions());
  }
  updateItem(id:number,payload:any):Observable<object>{
    return this.http.put(this.endpoint+"?id="+id,payload,this.getHttpOptions())
  }
  deleteItem(id: number):Observable<any>{
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
  getPublicHttpOptions() {
    return {
      headers: new HttpHeaders({
      'content-type':'application/json',
      })
    };
  }


}
