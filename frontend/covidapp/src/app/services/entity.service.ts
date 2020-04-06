import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { Entity } from "../models/entity";
import { environment } from '../../environments/environment';
import { Page, queryPaginated, queryPaginatedLocations} from '../pagination';

@Injectable({
  providedIn: 'root'
})
export class EntityService {
  private endpoint = environment.apiURL+"/api/public/entity/";
  private fbendpoint = environment.apiURL+"/api/public/feedback/";
  private listEndPoint = environment.apiURL+"/api/public/entity/";
  private createEndPoint = environment.apiURL+"/api/public/create/";
  private bulkDeleteEndpoint = environment.apiURL+"/api/public/bulkdeleteapt/";
  constructor( private http :  HttpClient ) { }
  getItem(id:number):Observable<any>{
    return this.http.get(this.endpoint+"?id="+id,this.getHttpOptions());
  }
  getItemPublic(id:number):Observable<any>{
    return this.http.get(this.endpoint+"?id="+id,this.getPublicHttpOptions());
  }

  list(urlOrFilter?: string | object): Observable<Page<Entity>> {
    return queryPaginated<Entity>(this.http, this.listEndPoint, false, urlOrFilter);
  }
  geoList(geoBounds:object, urlOrFilter?: string | object): Observable<Page<Entity>> {
    return queryPaginatedLocations<Entity>(this.http, this.listEndPoint, geoBounds, urlOrFilter);
  }
  getAllItems(): Observable<any>{
    return this.http.get(this.listEndPoint,this.getHttpOptions());
  }
  
  bulkDeleteItems(data){
    return this.http.post(this.bulkDeleteEndpoint,data,this.getHttpOptions());
  }
  createItem(entity:Entity){
    return this.http.post(this.endpoint,entity,this.getHttpOptions());
  }
  createFeedback(feedback:any){
    console.log("Creating feedback");
    return this.http.post(this.fbendpoint,feedback,this.getHttpOptions());
  }
  createItemPublic(entity:Entity){
    return this.http.post(this.createEndPoint,entity,this.getPublicHttpOptions());
  }
  updateItem(id:number,payload:any):Observable<object>{
    return this.http.put(this.endpoint+"?id="+id,payload,this.getHttpOptions())
  }
  patchItem(id:number,payload:any):Observable<object>{
    return this.http.patch(this.endpoint+"?id="+id,JSON.stringify(payload),this.getHttpOptions())
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
