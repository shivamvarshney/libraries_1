import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { apiUrls } from '@src/core/utills/apiEndPoints';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class RolesService {

  constructor(private _http: HttpClient) {  }

  onPostAPI(APIEndPoint, params) {
    return this._http.post(APIEndPoint, params, { observe: "response" });
  }
  onGetAPI(APIEndPoint) {
    return this._http.get(APIEndPoint);
  }
}
 