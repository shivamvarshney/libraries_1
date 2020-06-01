import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiUrls } from '@src/core/utills/apiEndPoints';
import { Observable } from 'rxjs';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
}) 

export class MasterDataService {

  constructor(private _http: HttpClient) {  }

  getUserMCompleteMasterData(): Observable<any>{
    let apiRequests = [];
    apiRequests.push(this._http.post(apiUrls.getGeoDefinition, {}));
    return forkJoin(apiRequests);
  }
  getRoleMCompleteMasterData(): Observable<any>{
    let apiRequests = [];
    apiRequests.push(this._http.post(apiUrls.getMasterData, {}));
    apiRequests.push(this._http.get(apiUrls.siteSumary)); 
    return forkJoin(apiRequests);
  }

  getCompleteMasterData(): Observable<any>{
    let apiRequests = [];
    apiRequests.push(this._http.post(apiUrls.getMasterData, {}));
    apiRequests.push(this._http.post(apiUrls.getGeoDefinition, {}));
    apiRequests.push(this._http.get(apiUrls.siteSumary)); 
    return forkJoin(apiRequests);
  }


  masterPostAPI(APIEndPoint, params): Observable<any> {
    return this._http.post(APIEndPoint, params, { observe: "response" });
  }
  masterGetAPI(APIEndPoint): Observable<any> {
    return this._http.get(APIEndPoint);
  }

  getSiteMasterData(updatedUrl): Observable<any>{     
    return this._http.post(updatedUrl, {})
  }

  getmasterData(): Observable<any>{     
    return this._http.post(apiUrls.getMasterData, {})
  }

  getSiteGeoLocationPagination(paginationObject): Observable<any>{
    return this._http.post(apiUrls.getGeoLocationData,  paginationObject )
  }

  getSiteGeoLocationData(): Observable<any>{
    return this._http.post(apiUrls.getGeoLocationData, {})
  }

  getGeoFields():Observable<any>{
    return this._http.post(apiUrls.getGeoDefinition, {})
  } 

  getAllSItes():Observable<any>{
    return this._http.get(apiUrls.siteSumary); 
  }

  getAllSitePerLvele(levelIds): Observable<any>{
    return this._http.post(apiUrls.siteLists,  levelIds )
  }
  getSiteHierarchy(siteIds): Observable<any>{
    return this._http.post(apiUrls.sitesSummary,  siteIds )
  }
}
 