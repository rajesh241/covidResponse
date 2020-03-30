import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { Apartment } from "../models/apartment";
import { environment } from '../../environments/environment';
import { Page, queryPaginated, queryPaginatedLocations} from '../pagination';

@Injectable({
  providedIn: 'root'
})
export class ApartmentService {
  private endpoint = environment.apiURL+"/api/rental/apartment/";
  private listEndPoint = environment.apiURL+"/api/rental/apartment/";
  private bulkDeleteEndpoint = environment.apiURL+"/api/rental/bulkdeleteapt/";
  constructor( private http :  HttpClient ) { }
  getApartment(id:number):Observable<any>{
    return this.http.get(this.endpoint+"?id="+id,this.getHttpOptions());
  }

  list(urlOrFilter?: string | object): Observable<Page<Apartment>> {
    return queryPaginated<Apartment>(this.http, this.listEndPoint, urlOrFilter);
  }
  geoList(geoBounds:object, urlOrFilter?: string | object): Observable<Page<Apartment>> {
    return queryPaginatedLocations<Apartment>(this.http, this.listEndPoint, geoBounds, urlOrFilter);
  }
  getAllApartments(): Observable<any>{
    return this.http.get(this.listEndPoint,this.getHttpOptions());
  }
  
  apartmentBulkDelete(data){
    return this.http.post(this.bulkDeleteEndpoint,data,this.getHttpOptions());
  }
  apartmentCreate(apartment:Apartment){
    return this.http.post(this.endpoint,apartment,this.getHttpOptions());
  }
  apartmentUpdate(id:number,payload:any):Observable<object>{
    return this.http.put(this.endpoint+"?id="+id,payload,this.getHttpOptions())
  }
  apartmentDelete(id: number):Observable<any>{
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
