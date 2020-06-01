import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppUtills } from '@src/core/utills/appUtills';
import { FacadeService } from '@src/core/services/facade.service';
import { environment } from '@environment/environment';
import { AppConstants } from '@src/core/utills/constant';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {

    constructor(
        private ngxService: NgxUiLoaderService,
        private facadeService: FacadeService,
        private _router: Router
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let tokenValue = AppUtills.getValue('token') ? AppUtills.getValue('token') : '';
        const loginType = AppUtills.getValue('loginType') ? JSON.parse(AppUtills.getValue('loginType')).toUpperCase() : 'MSISDN';
        const appLang = AppUtills.getValue('language') ? AppUtills.getValue('language') : 'en';
        let externalClient = AppUtills.getValue('externalClient') ? AppUtills.getValue('externalClient') : '';
        let externalServiceId = AppUtills.getValue('externalServiceId') ? AppUtills.getValue('externalServiceId') : '';
        let umLoginClientId = '';
        let apikey: string = '';
        if (request.url.indexOf('login') !== -1) {
            apikey = environment.BFE_API_KEY;
        }
        if (request.url.indexOf("v2/login") >= 0) {
            umLoginClientId = '1';
        }
        let setHeaders = {
            'Authorization': tokenValue ? 'Bearer ' + tokenValue : '',
            "x-client-id": externalClient ? externalClient : umLoginClientId,
            "lang": appLang,
            "x-login-module": loginType,
            "x-app-name": "sales-portal",
            "x-app-type": "web",
            "x-app-version": "1.0.0",
            "x-channel": "2",
            "x-service-id": externalServiceId ? externalServiceId : AppConstants.serviceId,
            "x-api-key": apikey
        }
        if (request.url.indexOf('upload-users') < 0) {
            setHeaders['Content-Type'] = 'application/json'
        }
        request = request.clone({ setHeaders: setHeaders });
        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                this.ngxService.stop();
                if (error && error.status && ((error.status == 401) || (error.status == 403)) && (typeof error.ok == 'boolean' && error.ok == false)) {
                    let requestSource = AppUtills.getValue('source') ? AppUtills.getValue('source') : '';
                    if (requestSource == 'external') {
                        this._router.navigate(['/unauthorized-page']);
                    } else {
                        AppUtills.removeValues();
                        let message = "Session expired";
                        /*
                        if (error.error) {
                            message = error.error;
                        }
                        */
                        this.facadeService.openArchivedSnackBar(message, 'Retry');
                        this._router.navigate(['/login']);                        
                    }
                }
                return throwError(error);
            })
        );
    }
}
