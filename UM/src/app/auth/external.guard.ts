import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { FacadeService } from '@src/core/services/facade.service';
import { AppUtills } from '@src/core/utills/appUtills';
import { apiUrls } from '@src/core/utills/apiEndPoints';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';


@Injectable({
  providedIn: 'root'
})
export class ExternalZGuard implements CanActivate {

  constructor(private ngxService: NgxUiLoaderService, private facadeService: FacadeService, private myRoute: Router, private _http: HttpClient) {

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    if (state.root.queryParams && state.root.queryParams['sso-token']) {
      let updatedToken = state.root.queryParams['sso-token'];
      let ssoSource = state.root.queryParams['sso-source'];
      let ssoClient = state.root.queryParams['sso-client'];
      let ssoServiceId = state.root.queryParams['sso-serviceId'];
      let ssoCreateAgentButtonLabel = state.root.queryParams['sso-createAgentButtonLabel'];
      let ssoCreateAgentRedirectUrl = state.root.queryParams['sso-createAgentRedirectUrl'];
      let getSpaceArray = updatedToken.split(' ');
      let keySpecificToken = '';
      for (var i = 0; i < getSpaceArray.length; i++) {
        keySpecificToken += getSpaceArray[i] + '+';
      }
      let lastKeyIndex = keySpecificToken.lastIndexOf("+");
      updatedToken = keySpecificToken.substring(0, lastKeyIndex);
      AppUtills.setValue('token', updatedToken);
      AppUtills.setValue('ssoSource', ssoSource);
      AppUtills.setValue('externalClient', ssoClient);
      AppUtills.setValue('externalServiceId', ssoServiceId);
      AppUtills.setValue('source', 'external');
      this.ngxService.start();
      let usersData = this._http.get(apiUrls.user);
      let permissionsData = this._http.get(apiUrls.masterPermissions);
      if (ssoCreateAgentRedirectUrl && ssoCreateAgentRedirectUrl != '') {
        if (next.fragment) {
          ssoCreateAgentRedirectUrl = ssoCreateAgentRedirectUrl + '#' + next.fragment;
        }
        AppUtills.setValue('ssoCreateAgentButtonLabel', ssoCreateAgentButtonLabel);
        AppUtills.setValue('ssoCreateAgentRedirectUrl', ssoCreateAgentRedirectUrl);
        let apiRequests = [];
        apiRequests.push(this._http.get(apiUrls.user));
        apiRequests.push(this._http.get(apiUrls.masterPermissions));
        apiRequests.push(this._http.post(apiUrls.getMasterData, {}));
        apiRequests.push(this._http.get(apiUrls.siteSumary));
        apiRequests.push(this._http.post(apiUrls.getGeoDefinition, {}));
        return forkJoin(apiRequests).pipe(
          map((resp: any) => {
            AppUtills.setValue('userData', JSON.stringify(resp[0].result));
            AppUtills.setValue('masterPermissions', JSON.stringify(resp[1].result));
            AppUtills.setValue('masterData', JSON.stringify(resp[2].result));
            AppUtills.setValue('masterSites', JSON.stringify(resp[3].result));
            resp[4].result.map(geoFieldsData => {
              if (geoFieldsData.type == "Sales Geographical Hierarchy") {
                let geoFieldsCounter = 1;
                let geoFieldsObj = [];
                let apiRequests = [];
                geoFieldsData.levels.map((fieldV, fieldK) => {
                  let geoFieldObj = { fieldLevelId: 'L' + geoFieldsCounter, fieldLevel: fieldV }
                  geoFieldsObj.push(geoFieldObj);
                  let preparedUrl = apiUrls.siteLevelHirerchy + '?levelId=' + geoFieldsCounter;
                  let getgeoLevelData = this._http.post(preparedUrl, {});
                  apiRequests.push(getgeoLevelData);
                  geoFieldsCounter += 1;
                });
                AppUtills.removeValue('geoFields');
                AppUtills.setValue('geoFields', JSON.stringify(geoFieldsObj));
                return forkJoin(apiRequests).subscribe(
                  (geolocations: any) => {
                    if (geolocations) {
                      let geoData = {};
                      geolocations.map((geolocation, key) => {
                        if (geolocation.statusCode == 200 && geolocation.result && geolocation.result.length > 0) {
                          let preparedLevel = 'L' + geolocation.result[0].levelHierarchy.levelId;
                          geoData[preparedLevel] = [];
                          geolocation.result.map(iteration => {
                            let parentId = '';
                            let parentLevel = '';
                            if (iteration.parent) {
                              parentId = iteration.parent.id;
                              parentLevel = 'L' + iteration.parent.levelHierarchy.levelId;
                            }
                            let preparedObj = { id: iteration.id, level: iteration.levelName, rootlevel: preparedLevel, parent: parentId, parentLevel: parentLevel }
                            geoData[preparedLevel].push(preparedObj);
                          });
                        }
                      });
                      AppUtills.removeValue('masterGeoLocations');
                      AppUtills.setValue('masterGeoLocations', JSON.stringify(geoData));
                      this.ngxService.stop();
                      return true;
                    }
                  }
                );
              }
            });                       
            return true;
          }),
          catchError(err => {
            this.ngxService.stop();
            return of(true);
          })
        )
      } else {
        return forkJoin([usersData, permissionsData]).pipe(
          map((resp: any) => {
            AppUtills.setValue('userData', JSON.stringify(resp[0].result));
            AppUtills.setValue('masterPermissions', JSON.stringify(resp[1].result));
            this.ngxService.stop();
            return true;
          }),
          catchError(err => {
            this.ngxService.stop();
            return of(true);
          })
        )
      }
    } else {
      return of(true);
    }
  }
}