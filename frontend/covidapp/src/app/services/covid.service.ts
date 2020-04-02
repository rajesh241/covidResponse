import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { Covid } from "../models/covid";
import { environment } from '../../environments/environment';
import { Page, queryPaginated, queryPaginatedLocations} from '../pagination';

@Injectable({
  providedIn: 'root'
})
export class CovidService {
  private endpoint = environment.apiURL+"/api/public/covid/";
  private listEndPoint = environment.apiURL+"/api/public/covid/";
  private bulkDeleteEndpoint = environment.apiURL+"/api/public/bulkdeleteapt/";
  constructor( private http :  HttpClient ) { }
  getItem(id:number):Observable<any>{
    return this.http.get(this.endpoint+"?id="+id,this.getHttpOptions());
  }

  list(urlOrFilter?: string | object): Observable<Page<Covid>> {
    return queryPaginated<Covid>(this.http, this.listEndPoint, false, urlOrFilter);
  }
  geoList(geoBounds:object, urlOrFilter?: string | object): Observable<Page<Covid>> {
    return queryPaginatedLocations<Covid>(this.http, this.listEndPoint, geoBounds, urlOrFilter);
  }
  getAllItems(): Observable<any>{
    return this.http.get(this.listEndPoint,this.getHttpOptions());
  }
  
  itemBulkDelete(data){
    return this.http.post(this.bulkDeleteEndpoint,data,this.getHttpOptions());
  }
  createItem(covid:Covid){
    return this.http.post(this.endpoint,covid,this.getHttpOptions());
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


}
