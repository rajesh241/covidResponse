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
    private requestEndPoint = environment.apiURL+"/api/public/request/";
    private pledgeEndPoint = environment.apiURL+"/api/public/pledge/";
    private stateEndPoint = environment.apiURL+"/api/public/states/";
    private districtEndPoint = environment.apiURL+"/api/public/districts/";
    private historyEndPoint = environment.apiURL+"/api/public/entityhistory/";
    private versionEndPoint = environment.apiURL+"/api/public/version/";
    private entityListEndPoint = environment.apiURL+"/api/public/entitylist/";
    private createEndPoint = environment.apiURL+"/api/public/create/";
    private bulkDeleteEndpoint = environment.apiURL+"/api/public/bulkdeleteapt/";
    private bulkOperationEndpoint = environment.apiURL+"/api/public/bulkoperation/";
    private locationEndPoint = environment.apiURL+'/api/public/location/';
    private neo4jEndPoint = 'http://vivekdse.ngrok.io/neo/path/';

    private page$;

    constructor( private http :  HttpClient ) { }

    getItem(id:number):Observable<any>{
	return this.http.get(this.endpoint+"?id="+id,this.getHttpOptions());
    }

    getVersion():Observable<any>{
	return this.http.get(this.versionEndPoint, this.getPublicHttpOptions());
    }

    findRoutes(start, end):Observable<any>{
	return this.http.get(this.neo4jEndPoint + `${start}/${end}`, this.getPublicHttpOptions());
    }

    getItemPublic(id:number):Observable<any>{
	return this.http.get(this.endpoint+"?id="+id,this.getPublicHttpOptions());
    }

    getAllHistory(id:number):Observable<any>{
	return this.http.get(this.historyEndPoint+"?ordering=-id&entity__id="+id,this.getPublicHttpOptions());
    }

    list(urlOrFilter?: string | object): Observable<Page<Entity>> {
	return queryPaginated<Entity>(this.http, this.entityListEndPoint, false, urlOrFilter);
    }

    createRequest(data:any) {
	console.log('In Createrequest()', data);
	return this.http.post(this.requestEndPoint, JSON.stringify(data), this.getHttpOptions());
    }

    patchRequest(id:number, data:any): Observable<object> {
	console.log('In Createrequest()', data);
	return this.http.patch(this.requestEndPoint + '?id=' + id, data, this.getHttpOptions())
    }

    getRequest(id:number): Observable<any> {
	return this.http.get(this.requestEndPoint + '?id=' + id, this.getHttpOptions());
    }

    listRequest(urlOrFilter?: string | object): Observable<Page<any>> {
	return queryPaginated<any>(this.http, this.requestEndPoint, false, urlOrFilter);
    }

    pledgeList(urlOrFilter?: string | object): Observable<Page<any>> {
	return queryPaginated<any>(this.http, this.pledgeEndPoint, false, urlOrFilter);
    }

    geoList(geoBounds:object, urlOrFilter?: string | object): Observable<Page<Entity>> {
	return queryPaginatedLocations<Entity>(this.http, this.entityListEndPoint, geoBounds, urlOrFilter);
    }

    getAllItems(): Observable<any>{
	return this.http.get(this.entityListEndPoint,this.getHttpOptions());
    }

    getAllStates(): Observable<any>{
	return this.http.get(this.stateEndPoint+"?limit=10000&ordering=state",this.getHttpOptions());
    }

    getAllDistricts(): Observable<any>{
	return this.http.get(this.districtEndPoint+"?limit=10000&ordering=district",this.getHttpOptions());
    }

    getStates(): Observable<any>{
	return this.http.get(this.locationEndPoint+'?location_type=state&ordering=name&limit=100',this.getHttpOptions());
    }

    getDistricts(): Observable<any>{
	return this.http.get(this.locationEndPoint+'?location_type=district&ordering=name&limit=10000',this.getHttpOptions());
    }

    bulkDeleteItems(data){
	return this.http.post(this.bulkDeleteEndpoint,data,this.getHttpOptions());
    }

    createItem(entity:any){
	return this.http.post(this.endpoint,JSON.stringify(entity),this.getHttpOptions());
    }

    createBulkOperation(entity:any){
	return this.http.post(this.bulkOperationEndpoint,JSON.stringify(entity),this.getHttpOptions());
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

    getEntityPages() {
	return this.page$;
    }

    setEntityPages(page$) {
	this.page$ = page$
    }
}
