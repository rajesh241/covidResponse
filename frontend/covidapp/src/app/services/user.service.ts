import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import {map, tap} from 'rxjs/operators';
import { User } from "../models/user";
import { PublicUser } from "../models/publicuser";
import { environment } from '../../environments/environment';
import { Page, queryPaginated, queryPaginatedLocations} from '../pagination';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private endpoint = environment.apiURL+"/api/user/";
    private listEndPoint = environment.apiURL+"/api/user/list";
    private publicListEndPoint = environment.apiURL+"/api/user/public";
    private teamPublicEndPoint = environment.apiURL+"/api/user/team/public";
    private orgPublicEndPoint = environment.apiURL+"/api/user/organization/public";
    private orgEndPoint = environment.apiURL+"/api/user/organization/";
    private teamEndPoint = environment.apiURL+"/api/user/team/";
    private editEndPoint = environment.apiURL+"/api/user/modify/profile/";
    private bulkDeleteEndpoint = environment.apiURL+"/api/user/bulkdelete/";
    private profileEndPoint = environment.apiURL+"/api/user/me/";
    insertToken:boolean = true;
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
        return this.http.get(this.listEndPoint,this.getHttpOptions());
    }

    getAllUsersPublic(userteam:any): Observable<any>{
        return this.http.get(this.publicListEndPoint+"?limit=10000&formio_userteam="+userteam,this.getPublicHttpOptions());
    }

    getAllGroupsPublic(): Observable<any>{
        return this.http.get(this.teamPublicEndPoint+"?limit=10000",this.getPublicHttpOptions());
    }

    orgCreate(payload:any) {
        return this.http.post(this.orgEndPoint, payload, this.getEditHttpOptions());
    }

    getAllOrgsPublic(): Observable<any>{
        return this.http.get(this.orgPublicEndPoint+"?limit=10000",this.getPublicHttpOptions());
    }

    getOrgs(urlOrFilter?: string | object) {
        return queryPaginated<any>(this.http, this.orgEndPoint, this.insertToken, urlOrFilter);
    }

    list(urlOrFilter?: string | object): Observable<Page<User>> {
        return queryPaginated<User>(this.http, this.listEndPoint, this.insertToken, urlOrFilter);
    }

    publicList(urlOrFilter?: string | object): Observable<Page<PublicUser>> {
        return queryPaginated<PublicUser>(this.http, this.publicListEndPoint, this.insertToken, urlOrFilter);
    }

    search(filter: {name: string} = {name: ''}, page = 1): Observable<User> {
	return this.http.get(this.publicListEndPoint,this.getPublicHttpOptions())
	    .pipe(
		tap((response: any) => {
		    response.results = response.results
		    //.map(user => new User({'id': user.id, 'name': user.name}))
		    // Not filtering in the server since in-memory-web-api has somewhat restricted api
			.filter(user => user.name.includes(filter.name))

		    return response;
		})
	    );
    }

    userCreate(payload:any){
        return this.http.post(this.endpoint,payload,this.getEditHttpOptions());
    }

    teamCreate(payload:any){
        return this.http.post(this.teamEndPoint,payload,this.getEditHttpOptions());
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

    getPublicHttpOptions() {
        return {
            headers: new HttpHeaders({
                'content-type':'application/json',
            })
        };
    }
}
