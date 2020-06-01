import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppUtills } from '@src/core/utills/appUtills';
import { FacadeService } from '@src/core/services/facade.service';
import { AppConstants } from '@src/core/utills/constant';
import { environment } from '@environment/environment';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {

    constructor(
        private ngxService: NgxUiLoaderService,
        private facadeService: FacadeService,
        private _router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const tokenValue = AppUtills.getValue('token') ? AppUtills.getValue('token') : '';
        const loginType = AppUtills.getValue('loginType') ? JSON.parse(AppUtills.getValue('loginType')).toUpperCase() : 'MSISDN';
        const appLang = AppUtills.getValue('language') ? AppUtills.getValue('language') : 'en';
        let apikey: string = ''; 
        if (request.url.indexOf('login') !== -1) {
            apikey = environment.BFE_API_KEY; //'744abc12-5ecb-4423-8a91-04f49c6efde7'
        }
        let setHeadersData = {
            'Authorization': tokenValue ? 'Bearer ' + tokenValue : '',
            "x-client-id": AppConstants.clientId,
            "lang": appLang,
            "x-login-module": loginType,
            "x-app-name": "sales-portal",
            "x-app-type": "web",
            "x-app-version": "1.0.0",
            "x-channel": "2",
            "x-service-id": AppConstants.serviceId,
            "x-api-key": apikey
        }
        if (request.url.indexOf('bulkUpload') < 0) {
            setHeadersData['Content-Type'] = 'application/json'
        }
        request = request.clone({
            setHeaders: setHeadersData
        });
        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                this.ngxService.stop();
                if (error && error.status && ((error.status == 401) || (error.status == 403)) && (typeof error.ok == 'boolean' && error.ok == false)) {
                    AppUtills.removeValues();
                    let message = "Session expired";
                    /*
                    if (error.message) {
                        message = error.message;
                    }
                    */
                    this.facadeService.openArchivedSnackBar(message, 'Retry');
                    this._router.navigate(['/login']);                    
                }
                return throwError(error);
            })
        );
    }
}
