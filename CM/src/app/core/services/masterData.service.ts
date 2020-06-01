import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiUrls } from '@src/core/utills/apiEndPoints';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MasterDataService {

  constructor(private _http: HttpClient) {  }

  getmasterData(): Observable<any>{    
    return this._http.post(apiUrls.getMasterData, {})
  }

  getSiteGeoLocationData(): Observable<any>{
    return this._http.post(apiUrls.getGeoLocationData, {})
  }

  getGeoFields():Observable<any>{
    return this._http.post(apiUrls.getGeoDefinition, {})
  }
}
 