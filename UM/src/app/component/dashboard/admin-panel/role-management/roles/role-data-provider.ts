import { AafGridDataProvider } from '@src/core/aaf-grid/aaf-grid-data-provider';
import { HttpClient } from '@angular/common/http';
import { apiUrls } from '@src/core/utills/apiEndPoints';
import { Injectable } from '@angular/core';
import { AppUtills } from '@src/core/utills/appUtills';
import { FacadeService } from '@src/core/services/facade.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
interface AssignedRole {
    id: string,
    name: string,
    role: string
}; 
@Injectable({
    providedIn: 'root'
}) 
export class RoleDataProvider implements AafGridDataProvider<AssignedRole>{
    constructor(private facadeService:FacadeService, 
        private http: HttpClient,
        private router: Router,
        private activatedRoutes:ActivatedRoute) { }
    getData(objInfo: any) {                         
        let pagingObj =  Object.keys(objInfo.pageInfo);
        let filtersObj =  Object.keys(objInfo.fiterData);
        let preparedRequestBody = {};
        pagingObj.map(val=>{
            preparedRequestBody[val] = objInfo.pageInfo[val];
        });
        if(filtersObj.length > 0){
            filtersObj.map(filterKey=>{
                preparedRequestBody[filterKey] = objInfo.fiterData[filterKey];
            });
        }
        this.activatedRoutes.params.subscribe((params: Params) => {                     
            if (params.status) {
                preparedRequestBody['filterType'] = params.status.toUpperCase();
            }else{
                preparedRequestBody['filterType'] = 'CLEAR_FILTER';
            }
        });        
        return this.http.post(apiUrls.roleMaster, preparedRequestBody);       
        /*
        let urlString = apiUrls.roleList;
        let pagingString = AppUtills.prepareQueryParam(objInfo.pageInfo);
        let filterDataString = AppUtills.prepareQueryParam(objInfo.fiterData);
        if (pagingString && filterDataString) {
            urlString += `?${pagingString}&${filterDataString}`;
        }
        else if (pagingString) {
            urlString += `?${pagingString}`;
        } else if (filterDataString) {
            urlString += `?${filterDataString}`;
        }        
        return this.http.get(urlString);
        */
    }
}