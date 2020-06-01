import { Injectable } from '@angular/core';
import {EventSourcePolyfill} from 'ng-event-source';
import { apiUrls } from '@src/core/utills/apiEndPoints';
import { AppConstants } from '@src/core/utills/constant';
import { AppUtills } from '@src/core/utills/appUtills';
import { environment } from '@environments/environment'

@Injectable({
  providedIn: 'root'
})
export class SseService {

  constructor() { }   

  getEventSource():EventSourcePolyfill{
    let tokenValue = AppUtills.getValue('token');
    const loginType = AppUtills.getValue('loginType') ? JSON.parse(AppUtills.getValue('loginType')).toUpperCase() : 'MSISDN';
    const appLang = AppUtills.getValue('language') ? AppUtills.getValue('language') : 'en';
    return new EventSourcePolyfill(apiUrls.assignmentWatch,{ 
        headers: { 
          "x-client-id": AppConstants.clientId,
          "lang": appLang,
          "x-login-module": loginType,
          "x-app-name": "sales-portal",
          "x-app-type": "web",
          "x-app-version": "1.0.0",
          "x-channel": "1",
          "x-service-id": "snd_user_mngt_service_app",
          "x-api-key": environment.BFE_API_KEY,
          'Authorization': tokenValue ? AppConstants.tokenAccessSpecifier+' '+tokenValue : ''             
        },
        heartbeatTimeout: 44000, 
        connectionTimeout: 45000,
        errorOnTimeout: false  
      });
  }
}