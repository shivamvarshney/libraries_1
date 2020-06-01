import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  constructor(private _http: HttpClient) { }

  onPostAPI(APIEndPoint, params) {
    return this._http.post(APIEndPoint, params, { observe: "response" });
  }

  onGetAPI(APIEndPoint) {
    return this._http.get(APIEndPoint);
  }

  // fetchUser() {
  //   return this._http.get(apiUrls.user);
  // }
  //
  // login(loginParams) {
  //   return this._http.post(apiUrls.login, loginParams, { observe: "response" });
  // }

  // logout(loginParams) {
  //   return this._http.post(apiUrls.logout, loginParams, { observe: "response" });
  // }

  // postAPI(userRequest) {
  //   return this._http.post(apiUrls.resetPin, userRequest, { observe: "response" });
  // }

  // resetAPI(userRequest) {
  //   return this._http.post(apiUrls.forgotPin, userRequest, { observe: "response" });
  // }
}
