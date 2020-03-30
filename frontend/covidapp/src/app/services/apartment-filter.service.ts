import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Apartment } from '../models/apartment'
import { Page, queryPaginated} from '../pagination';
import { environment } from '../../environments/environment';

@Injectable()
export class ApartmentFilterService {
  baseUrl = environment.apiURL+"/api/rental/apartment/";
  constructor(
    private http: HttpClient
  ) { }

  list(urlOrFilter?: string | object): Observable<Page<Apartment>> {
    return queryPaginated<Apartment>(this.http, this.baseUrl, urlOrFilter);
  }
}
