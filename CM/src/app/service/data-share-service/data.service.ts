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

   resetTimerData(timerData: string) {
      this._listners.next(timerData);
   }

   fetchAgentDetails(agentInfo: string) {
      this._listners.next(agentInfo);
   }

   alreadyApprovedStatus(status: string) {
      this._listners.next(status);
   }


}