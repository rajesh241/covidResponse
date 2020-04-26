import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export class Page<T> {
    count: number;      // total number of items
    page_no: number;      // total number of items
    total_pages: number;      // total number of items
    next: string;       // URL of the next page
    previous: string;   // URL of the previous page
    results: Array<T>;  // items for the current page
}

export function queryPaginated<T>(http: HttpClient, baseUrl: string, insertToken:boolean, urlOrFilter?: string | object): Observable<Page<T>> {
    let params = new HttpParams();
    let url = baseUrl;
    
    if (typeof urlOrFilter === 'string') {
        // we were given a page URL, use it
        url = urlOrFilter;
    } else if (typeof urlOrFilter === 'object') {
        // we were given filtering criteria, build the query string
        // isnum = /^\d+$/.test(val);
        Object.keys(urlOrFilter).sort().forEach(key => {
            const value = urlOrFilter[key];
            console.log(key+value);
            if ( (value !== null) && (/^\d+$/.test(value)) ) {
	        console.log(key+value)
                params = params.set(key, value.toString());
            }
            else if ( (value != null) && (key === "user_role")){
                params = params.set(key, value.toString());
            }
            else if ( (value != null) && (key === "search")){
                params = params.set(key, value.toString());
            }
            else if ( (value != null) && (key === "formio_usergroup")){
                params = params.set(key, value.toString());
            }
            else if ( (value != null) && (key === "volunteer")){
                params = params.set(key, value.toString());
            }
            else if ( (value != null) && (key === "status")){
                params = params.set(key, value.toString());
            }
            else if ( (value != null) && (key === "urgency")){
                params = params.set(key, value.toString());
            }
            else if ( (value != null) && (key === "record_type")){
                params = params.set(key, value.toString());
            }
            else if ( (value != null) && (key === "needHelp")){
                params = params.set(key, value.toString());
            }
            else if ( (value != "undefined")  && (key === "group__id")){
		console.log("this is not undefined value");
                params = params.set(key, value.toString());
            }
            else if ( (value != null) && (key === "facility")){
                params = params.set(key, value.toString());
            }
            else if ( (value != null) && (key === "volunteer")){
                key = 'extra_fields__volunteer';
                params = params.set(key, value.toString());
            }
            else if ( (value != null) && (key === "assigned_to_user__name__icontains")){
                params = params.set(key, value.toString());
            }
            else if ( (value != null) && (key === "assigned_to_user__id")){
                params = params.set(key, value.toString());
            }
            else if ( (value != null) && (key === "assigned_to_group__name__icontains")){
                params = params.set(key, value.toString());
            }
            else if ( (value != null) && (key === "ordering")){
                params = params.set(key, value.toString());
            }
            else if ( (value != null) && (key === "location")){
                let latitute = value.lat;
                let longitude = value.lng;
                console.log(latitute, longitude);
                let latitude__gte = latitute - 1;
                let longitude__gte = longitude - 1;
                let latitude__lte = latitute + 1;
                let longitude__lte = longitude + 1;
                console.log(`latitude__gte = ${latitude__gte}`);
                console.log(`longitude__gte = ${longitude__gte}`);
                console.log(`latitude__lte = ${latitude__lte}`);
                console.log(`longitude__lte = ${longitude__lte}`);

                params = params.set('latitude__gte', latitude__gte.toString());
                params = params.set('longitude__gte', longitude__gte.toString());
                params = params.set('latitude__lte', latitude__lte.toString());
                params = params.set('longitude__lte', longitude__lte.toString());
            }
        });
    }

    const token = localStorage.getItem("id_token");
    let headers = new HttpHeaders();
    headers = headers.set("Authorization", "Bearer " + token)
    console.log(headers);
    if (insertToken){
        return http.get<Page<T>>(url, {
            params: params,
	    headers: headers
        });
    }else{
        return http.get<Page<T>>(url, {
            params: params
        });
    }
}

export function queryPaginatedLocations<T>(http: HttpClient, baseUrl: string, geoBounds: object,urlOrFilter?: string | object): Observable<Page<T>> {
    let params = new HttpParams();
    let url = baseUrl;

    if (typeof urlOrFilter === 'string') {
        // we were given a page URL, use it
        url = urlOrFilter;
    } else if (typeof urlOrFilter === 'object') {
        // we were given filtering criteria, build the query string
        Object.keys(urlOrFilter).sort().forEach(key => {
            const value = urlOrFilter[key];
            if (value !== null) {
                params = params.set(key, value.toString());
            }
        });
    }

    const token = localStorage.getItem("id_token");
    let headers = new HttpHeaders();
    headers = headers.set("Authorization", "Bearer " + token)
    console.log(headers);
    return http.get<Page<T>>(url, {
        params: params
    });
}
