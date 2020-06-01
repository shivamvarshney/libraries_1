import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { ErrorDialogService } from '@service/error-dialog-service/error-dialog.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AppUtills } from '@src/core/utills/appUtills';
import { FacadeService } from '@src/core/services/facade.service';
import { AppConstants } from '@src/core/utills/constant';
import { apiUrls } from '@src/core/utills/apiEndPoints';
import { environment } from '@environment/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  hide = true;
  error: any;
  MSISDN: number;
  OTPStatus: boolean = false;
  tooltipMsg: string = '';
  isDisabled: boolean = false;
  hideOTPTimer: boolean = false;
  dummyFlag: string = "AUUID";
  checkLoginType: boolean = true;
  showAUUIDForm: boolean = false;
  showMSISDNForm: boolean = false;
  showAUUIDStatus: boolean = false;
  showMSISDNStatus: boolean = false;
  activeLoginType: boolean = true;
  loginFormData: any;
  timer: any = '00';
  minutes: number; // OTP initial timing
  interval;
  storeLoginType: string;
  currentVal: string = 'AUUID';
  auuid: string = 'auuid'; msisdn: string = 'msisdn'; password: string = 'password';
  loginTypeForm: FormGroup;
  auuidForm: FormGroup;
  msisdnForm: FormGroup;
  public apiResponseVariable;
  public getTranslationText;
  public errorMsg: boolean = false;
  public unauthorized_msg: any;
  private loginUnsubscription: Subscription;
  private userUnsubscription: Subscription;
  private loginStatusUnsubscription: Subscription;
  private verifyUserUnsubscription: Subscription;
  private masterPermissionUnsubscription: Subscription;
  numberLength = AppConstants.opcoConfig.numberLength;
  patternNum = AppConstants.opcoConfig.patternNum;
  min = AppConstants.opcoConfig.min;
  auuidMax = AppConstants.opcoConfig.auuidMax;
  msisdnMax = AppConstants.opcoConfig.msisdnMax;
  otpMaxLength = AppConstants.opcoConfig.otpMaxLength;
  loginTypePattern = environment.loginTypePattern;

  // ******** Slider image ******** //
  imageUrlArray = [
    "./assets/images/slider-1.png",
    "./assets/images/slider-2.png",
    "./assets/images/slider-3.png"
  ]

  constructor(
    private _routes: Router,
    private errorDialogService: ErrorDialogService,
    private _http: HttpClient,
    private ngxService: NgxUiLoaderService,
    private facadeService: FacadeService
  ) {
    // ******** redirect to dashboard if user already login ******** //
    if (facadeService.isLoggedIn()) {
      this.facadeService.navigateToDefaultLandingModule();
    }
  }

  onLoginCHanges() {
    // ******** pass eye ******** //    
    this.auuidForm.get('password').valueChanges.subscribe(
      pass => {
        (pass && pass.length > 0) ? this.showAUUIDStatus = true : this.showAUUIDStatus = false;
      }
    );

    this.msisdnForm.get('otp').valueChanges.subscribe(
      pass => {
        (pass && pass.length > 0) ? this.showMSISDNStatus = true : this.showMSISDNStatus = false;
      }
    );
  }

  ngOnInit() {

    // ******** loginType ************// 
    this.loginTypeForm = new FormGroup({
      loginTypeStatus: new FormControl('', [
        Validators.required,
        Validators.pattern(environment.regex)
      ])
    });

    // ******** AUUID Type ************//
    this.auuidForm = new FormGroup({
      number: new FormControl('', [
        Validators.required,
        Validators.minLength(this.min),
        Validators.pattern(this.patternNum)
      ]),
      password: new FormControl('', [
        Validators.required
      ])
    });

    // ******** MSISDN Type ************//
    this.msisdnForm = new FormGroup({
      number: new FormControl('',
        [
          Validators.required,
          Validators.minLength(this.min),
          Validators.pattern(this.patternNum)
        ]),
      otp: new FormControl('', [
        Validators.required,
        Validators.pattern("^[0-9]{4}$")
      ])
    });

    // ******** Check password eyes ************//
    this.onLoginCHanges();
  }

  // ******** Login Type form validation errors ******** //
  public loginHasError = (controlName: string, errorName: string) => {
    return this.loginTypeForm.controls[controlName].hasError(errorName);
  }

  // ******** AUUID Type form validation errors ******** //
  public hasAuuidError = (controlName: string, errorName: string) => {
    return this.auuidForm.controls[controlName].hasError(errorName);
  }

  // ******** Login form validation errors ******** //
  public hasError = (controlName: string, errorName: string) => {
    return this.msisdnForm.controls[controlName].hasError(errorName);
  }

  // ******** Check Login Type ***********//
  loginTypeAction(loginFormStatus: any) {
    this.loginFormData = loginFormStatus;
    this.storeLoginType = loginFormStatus.value.loginTypeStatus;
    if (loginFormStatus.controls.loginTypeStatus.value !== this.MSISDN) {
      clearInterval(this.interval);
      this.minutes = 0;
      //this.timer = '00';
      this.hideOTPTimer = false;
      this.isDisabled = false;
      this.tooltipMsg = '';
    }
    this.MSISDN = loginFormStatus.controls.loginTypeStatus.value;
    let loginTypeInfo = {
      'number': loginFormStatus.controls.loginTypeStatus.value
    }
    if (loginFormStatus.invalid) {
      return;
    } else {
      this.ngxService.start();
      this.verifyUserUnsubscription = this.facadeService.onPostAPI(apiUrls.verifyUser, loginTypeInfo).subscribe(res => {
        let data: any;
        if (res) {
          //this.ngxService.stop();
          data = res.body || res;
          if (data.statusCode == 200 && data.message) {
            let loginStatus = data.result;
            if (loginStatus) {
              this.auuidForm.get('number').setValue(this.storeLoginType);
              this.msisdnForm.get('number').setValue(this.storeLoginType);

              this.auuidForm.get('password').setValue('');
              this.msisdnForm.get('otp').setValue('');

              let loginStatus = data.result;
              if (loginStatus === "MSISDN") {
                //this.resendOTP();
                this.onSendOTPHandler(loginFormStatus, 'sendOTP');
              } else {
                this.checkLoginType = false;
                this.showMSISDNForm = false;
                this.showAUUIDForm = true;
                this.ngxService.stop();
              }
            }
          } else {
            this.ngxService.stop();
            this.facadeService.openArchivedSnackBar(data.message, 'Retry');
          }
        }
      }, error => {
        this.error = error;
        this.ngxService.stop();
        this.showAUUIDForm = false;
        this.showMSISDNForm = false;
        this.checkLoginType = true;
        if(AppUtills.showErrorMessage(error)){
          this.facadeService.openArchivedSnackBar('Something went wrong', 'Retry');
        }
      });
    }
  }

  // ******** On Login Action Handler ************//
  onSendOTPHandler(loginFormStatus, OTPStatus) {
    let sendResendURL = apiUrls[OTPStatus];
    let number = loginFormStatus.controls.loginTypeStatus.value;
    this.storeLoginType = loginFormStatus.value.loginTypeStatus;
    let loginTypeInfo = {
      'number': number
    }
    if (loginFormStatus.invalid) {
      return;
    } else {
      this.loginStatusUnsubscription = this.facadeService.onPostAPI(sendResendURL, loginTypeInfo).subscribe(res => {
        let data: any;
        if (res) {
          this.ngxService.stop();
          data = res.body || res;
          if (data.statusCode == 200 && data.message) {
            this.checkLoginType = false;
            this.showAUUIDForm = false;
            this.showMSISDNForm = true;
            if (data) {
              this.facadeService.openArchivedSnackBar(data.message, 'Success');
            }
          } else if (data.result && data.result.resetAt) {
            // if(this.hideOTPTimer){
            //   data.message = '';
            // }
            // AppUtills.setValue(number, data.result.resetAt)
            this.onResetTimerHandler(data);
            this.hideOTPTimer ? '' : this.facadeService.openArchivedSnackBar(data.message, 'Retry');
          } else {
            this.hideOTPTimer ? '' : this.facadeService.openArchivedSnackBar(data.message, 'Retry');
          }
        }
      }, error => {
        this.error = error;
        this.ngxService.stop();
        this.showAUUIDForm = false;
        this.showMSISDNForm = false;
        this.checkLoginType = true;
        if(AppUtills.showErrorMessage(error)){
          this.facadeService.openArchivedSnackBar('Something went wrong', 'Retry');
        }
      });
    }
  }

  // ******** Login form ******** //
  onSubmitAction(loginFormStatus: any, formControlName: string): Observable<any> {
    this.ngxService.start();
    let loginInfo = {
      'username': loginFormStatus.value.number,
      'password': loginFormStatus.value[formControlName]
    }
    if (loginFormStatus.invalid) {
      return;
    } else {
      this.loginUnsubscription = this.facadeService.onPostAPI(apiUrls.login, loginInfo).subscribe(res => {
        let data: any;
        if (res) {
          data = res.body || res;
          if ((data.statusCode == 200) && data.message) {
            this.facadeService.isLoggin();
            let tokenRes = data.result;
            if (tokenRes.accessToken) {
              let token = tokenRes.accessToken;
              /*if (tokenRes.tokenType && tokenRes.tokenType != '') {
                token = tokenRes.accessToken;
              }*/
              AppUtills.setValue('token', token);
              this.getUser();
            }
          } else {
            this.ngxService.stop();
            this.facadeService.openArchivedSnackBar(data.message, 'Retry');
          }
        }
      }, error => {
        //this.error = error;
        this.ngxService.stop();
        if(AppUtills.showErrorMessage(error)){
          this.facadeService.openArchivedSnackBar(error.error.message || 'Something went wrong', 'Retry');
        }
      });
    }
  }

  // ******** Get User Details ******** //
  getUser() {
    this.userUnsubscription = this.facadeService.onGetAPI(apiUrls.user).subscribe(res => {
      let data: any;
      if (res) {
        //this.ngxService.stop();
        data = res;
        if ((data.statusCode == 200) && data.message) {
          AppUtills.setValue('userData', JSON.stringify(data.result));
          this.masterPermissionUnsubscription = this.facadeService.onGetAPI(apiUrls.masterPermissions).subscribe(
            (resp: any) => {
              let data;
              if (resp) {
                data = resp;
                this.ngxService.stop();
                if ((data.statusCode == 200) && data.message) {
                  AppUtills.setValue('masterPermissions', JSON.stringify(data.result));
                  this.facadeService.navigateToDefaultLandingModule();
                } else {
                  this.facadeService.openArchivedSnackBar(data.message, 'Retry');
                }
              }
            }, err => {
              this.ngxService.stop();
              this.facadeService.navigateToDefaultLandingModule();
            });
        } else {
          this.ngxService.stop();
          this.facadeService.openArchivedSnackBar(data.message, 'RETRY');
        }
      }
    }, error => {
      this.error = error;
      this.ngxService.stop();
      if(AppUtills.showErrorMessage(error)){
        this.facadeService.openArchivedSnackBar('Something went wrong', 'Retry');
      }
    });
  }

  resendOTP() {
    this.ngxService.start();
    let loginData = this.loginFormData;
    this.onSendOTPHandler(loginData, 'resendOTP');
  }
  onResetTimerHandler(resetTimer) {
    this.tooltipMsg = resetTimer.message;
    let convertCurrectMiliSec: any;
    let serverDate = new Date(resetTimer.result.resetAt);
    let getMiliSec = serverDate.getTime();
    let convertServerMiliSec = this.convertMS(getMiliSec);
    let addOneMin = convertServerMiliSec.minute;
    this.isDisabled = true;
    this.hideOTPTimer = true;
    let staticSec: number = 60;
    //let secTimer = staticSec - convertServerMiliSec.seconds;
    //this.timer = convertServerMiliSec.seconds;

    clearInterval(this.interval);
    this.interval = setInterval(() => {
      if (this.timer > '0') {
        this.timer--;
        let currectDate = new Date();
        let getCurrentMiliSec = currectDate.getTime();
        convertCurrectMiliSec = this.convertMS(getCurrentMiliSec);
        this.minutes = addOneMin - convertCurrectMiliSec.minute - 1;
        this.timer = staticSec - (convertCurrectMiliSec.seconds);
        convertCurrectMiliSec.hour > convertServerMiliSec.hour ? clearInterval(this.interval) : '';
        (((document.getElementById('zeroMinuts') != null ? document.getElementById('zeroMinuts').innerText : '') == '00') && (this.timer == 0)) ? clearInterval(this.interval) : '';
        if ((convertCurrectMiliSec.hour === convertServerMiliSec.hour) && (convertCurrectMiliSec.minute === addOneMin) && (this.timer == 0 || '00')) {
          clearInterval(this.interval);
          this.minutes = 0;
          this.timer = '00';
          staticSec = 0;
          this.hideOTPTimer = false;
          this.isDisabled = false;
          this.tooltipMsg = '';
        }
      }
    }, this.timer);
  }

  convertMS(milliseconds) {
    var day, hour, minute, seconds;
    seconds = Math.floor(milliseconds / 1000);
    minute = Math.floor(seconds / 60);
    seconds = seconds % 60;
    hour = Math.floor(minute / 60);
    minute = minute % 60;
    day = Math.floor(hour / 24);
    hour = hour % 24;
    return {
      day: day,
      hour: hour,
      minute: minute,
      seconds: seconds
    };
  }

  backToHome() {
    if (!this.isDisabled) {
      this.auuidForm.reset();
      this.msisdnForm.reset();
      this.loginTypeForm.reset();
      this.checkLoginType = true;
      this.showAUUIDForm = false;
      this.showMSISDNForm = false;
    }
  }

  ngOnDestroy() {
    this.verifyUserUnsubscription ? this.verifyUserUnsubscription.unsubscribe() : '';
    this.loginStatusUnsubscription ? this.loginStatusUnsubscription.unsubscribe() : '';
    this.loginUnsubscription ? this.loginUnsubscription.unsubscribe() : '';
    this.userUnsubscription ? this.userUnsubscription.unsubscribe() : '';
    this.masterPermissionUnsubscription ? this.masterPermissionUnsubscription.unsubscribe() : '';
  }
}