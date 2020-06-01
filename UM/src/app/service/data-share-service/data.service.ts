import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable() 
export class DataService {
   
   private _listners = new Subject<any>();
   
   listen(): Observable<any> {
      return this._listners.asObservable();
   }
   filter(filterBy: string) {
      this._listners.next(filterBy);
   }

   userStatus(status: boolean) {
      this._listners.next(status);
   }


}