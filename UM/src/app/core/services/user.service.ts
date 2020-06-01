import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { apiUrls } from '@src/core/utills/apiEndPoints';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private _http: HttpClient) { }

  onPostAPI(APIEndPoint, params): Observable<any> {
    return this._http.post(APIEndPoint, params, { observe: "response" });
  }
  onGetAPI(APIEndPoint): Observable<any> {
    return this._http.get(APIEndPoint);
  }
  getUserById(userId) {
    let urlString = apiUrls.userList + '?id=' + userId;
    return this._http.post(urlString, {});
  }
  getAllReportsToUsers(reportsToObj): Observable<any>{
    return this._http.post(apiUrls.reportingUsers,  reportsToObj )
  }
}
