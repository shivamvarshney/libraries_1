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

  saveRole(saveRoleData,sveType): Observable<any>{
    let apiurl = apiUrls.saveRole;
    if(sveType == 'edit'){
      apiurl = apiUrls.saveEditRole;
    }
    return this._http.post(apiurl, saveRoleData);
  }
  getRoleById(roleId){
    const params = new HttpParams().set('id', roleId);
    return this._http.get(apiUrls.getRoleById, {params});
  }

  // getRoleReportsToMapping(){
  //   return this._http.get(apiUrls.roles);
  // }
  // getAllPermissionGroups(){
  //   return this._http.get(apiUrls.permissions);
  // }
  // getRoleTypes(){
  //   return this._http.get(apiUrls.roleTypes);
  // }
  // getLoginPartners(){
  //   return this._http.get(apiUrls.loginChannels);
  // }
  // getLoginModules(){
  //   return this._http.get(apiUrls.loginModules);
  // }
  // getRolesCount(){
  //   return this._http.get(apiUrls.roleCount);
  // }
  // getRoles(): Observable<any>{
  //   return this._http.get(apiUrls.roleList);
  // }
  // toggleRoleStatus(args): Observable<any> {
  //   return this._http.post(apiUrls.toggleRole, args);
  // }
}
 