import { Injectable, NgZone } from '@angular/core';
import { SseService } from './sse.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private _zone:NgZone,private _sseService:SseService) { }

  getServerSentEvents(){
    return Observable.create(observer=>{
      const eventSource = this._sseService.getEventSource();
      eventSource.onmessage = event=>{
        this._zone.run(()=>{
          observer.next(event);
        });
      }
      eventSource.onerror = error=>{
        this._zone.run(()=>{
          observer.next(event);
          //observer.error(error);
        })
      }
    })
  }
}
