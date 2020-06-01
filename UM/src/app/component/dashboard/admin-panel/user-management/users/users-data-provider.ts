import { FacadeService } from '@src/core/services/facade.service';
import { AafGridDataProvider } from '@src/core/aaf-grid/aaf-grid-data-provider';
import { HttpClient } from '@angular/common/http';
import { apiUrls } from '@src/core/utills/apiEndPoints';
import { Injectable } from '@angular/core';
import { AppUtills } from '@src/core/utills/appUtills';
import { ActivatedRoute, Router, Params } from '@angular/router';
interface AssignedKit {
    id: string,
    name: string,
    role: string
};
@Injectable({
    providedIn: 'root' 
})
export class UsersDataProvider implements AafGridDataProvider<AssignedKit>{
    constructor(
        private facadeService:FacadeService, 
        private http: HttpClient,
        private activatedRoutes:ActivatedRoute,
        private router: Router
        ) { }
    getData(objInfo: any) {
        let urlString = apiUrls.userList;
        let pagingString = AppUtills.prepareQueryParam(objInfo.pageInfo);     
        let filterDataString = '';   
        if(objInfo && objInfo.fiterData && Object.keys(objInfo.fiterData).length > 0){
            if(Object.keys(objInfo.fiterData).indexOf('action-selection') != -1){
                delete objInfo.fiterData['action-selection'];
            }          
            let valueOfFilter = '';
            Object.keys(objInfo.fiterData).forEach(function(key) {
                valueOfFilter = objInfo.fiterData[key];
            });
            filterDataString = `auuid=${valueOfFilter}&msisdn=${valueOfFilter}&firstName=${valueOfFilter}`;                                
        }
        if (pagingString && filterDataString) {
            urlString += `?${pagingString}&${filterDataString}`;
        }
        else if (pagingString) {
            urlString += `?${pagingString}`;
        } else if (filterDataString) {
            urlString += `?${filterDataString}`;
        }
        this.activatedRoutes.queryParams.subscribe((params:Params)=>{
            if(params.roleId && params.roleId != ''){
                urlString += `&roleId=${params.roleId}`; 
            }            
        });
        this.activatedRoutes.params.subscribe((params: Params) => {                        
            if (params.status) {
                if(params.status.toUpperCase() == 'ACTIVE'){
                    urlString += `&status=ACTIVE`;
                }else if(params.status.toUpperCase() == 'INACTIVE'){
                    urlString += `&status=INACTIVE`;
                }                
            }           
        }); 
        return this.http.post(urlString, {}); 
    }
}