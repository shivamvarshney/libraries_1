import { Injectable, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { retry } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs'; 
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class SalesService implements OnInit {
  public translationJSON = 'assets/i18n/en.json';
  private messageSource = new BehaviorSubject('default');
  currentMessage = this.messageSource.asObservable();
  count: any;
  error: any;

  constructor(private _http: HttpClient,
    private snakeBar: MatSnackBar,
    private _location: Location) { }

  changeMessage(message: any) {
    this.messageSource.next(message);
  }

  ngOnInit() {
  }

  // fetch transslation text from config files
  getTranslation() {
    return this._http.get(this.translationJSON).pipe(retry(3))
  }

  // Post Api Calls
  postAPI(postRequest) {
    return this._http.post(postRequest.url, postRequest.data, { observe: "response" });
  }
  //Get Api Calls
  getAPI(postRequest) {
    return this._http.get(postRequest.url);
  }

  // go to previous routing
  backClicked(): void {
    this._location.back();
  }

  // Toast popup message for response
  openArchivedSnackBar(resMsg: string, action: string) {
    if (resMsg) {
      this.snakeBar.open(resMsg, action, {
        duration: 3000
      });
    }
  }
}
